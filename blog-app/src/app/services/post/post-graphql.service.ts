import {inject, Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {catchError, map, Observable, take, tap, throwError} from 'rxjs';

import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';
import {ArticleMapperService} from '../mappers/article-mapper.service';

import {PostServiceInterface} from './post-service.interface';
import {PostStoreService} from './post-store.service';

const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      content
      rating
      categoryId
      imgSrc
      createdAt
    }
  }
`;

const GET_COMMENTS = gql`
  query GetComments($articleId: ID!) {
    commentsByArticle(articleId: $articleId) {
      id
      articleId
      username
      content
      rating
      createdAt
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createComment: $createCommentInput) {
      id
      articleId
      username
      content
      rating
      createdAt
    }
  }
`;

const ARTICLE_RATING_UP = gql`
  mutation ArticleRatingUp($id: ID!) {
    articleRatingUp(id: $id) {
      id
      title
      content
      rating
      categoryId
      imgSrc
      createdAt
    }
  }
`;

const ARTICLE_RATING_DOWN = gql`
  mutation ArticleRatingDown($id: ID!) {
    articleRatingDown(id: $id) {
      id
      title
      content
      rating
      categoryId
      imgSrc
      createdAt
    }
  }
`;

const COMMENT_RATING_UP = gql`
  mutation CommentRatingUp($id: ID!) {
    commentRatingUp(id: $id) {
      id
      articleId
      username
      content
      rating
      createdAt
    }
  }
`;

const COMMENT_RATING_DOWN = gql`
  mutation CommentRatingDown($id: ID!) {
    commentRatingDown(id: $id) {
      id
      articleId
      username
      content
      rating
      createdAt
    }
  }
`;

@Injectable()
export class PostGraphqlService implements PostServiceInterface {
  private apollo = inject(Apollo);
  private store = inject(PostStoreService);
  private mapper = inject(ArticleMapperService);

  getPostData(id: string): Observable<Article> {
    return this.apollo
        .query<any>(
            {query: GET_ARTICLE, variables: {id}, fetchPolicy: 'network-only'})
        .pipe(
            map(result => {
              const rawArticle = result.data?.article;
              if (!rawArticle) {
                throw new Error('Статья не найдена');
              }
              return this.mapper.mapToDomain(rawArticle);
            }),
            tap(post => {
              this.store.setPost(post);
            }),
            catchError(error => throwError(() => error)));
  }

  getComments(articleId: string): Observable<Comment[]> {
    return this.apollo
        .query<any>({
          query: GET_COMMENTS,
          variables: {articleId},
          fetchPolicy: 'network-only'
        })
        .pipe(
            map(result => {
              const rawComments = result.data?.commentsByArticle || [];
              return rawComments.map(
                         (c: any) => ({
                           id: c.id,
                           articleId: c.articleId,
                           rating: c.rating,
                           text: c.content,
                           author: c.username,
                           date: c.createdAt ?
                               new Date(c.createdAt).toLocaleString('ru-RU', {
                                 day: '2-digit',
                                 month: '2-digit',
                                 year: 'numeric',
                                 hour: '2-digit',
                                 minute: '2-digit'
                               }) :
                               new Date().toLocaleString('ru-RU', {
                                 day: '2-digit',
                                 month: '2-digit',
                                 year: 'numeric',
                                 hour: '2-digit',
                                 minute: '2-digit'
                               })
                         })) as Comment[];
            }),
            tap(comments => {
              if (comments) this.store.setComments(comments);
            }),
            catchError(error => throwError(() => error)));
  }

  addComment(commentData: {articleId: string; author: string; text: string}):
      Observable<Comment> {
    return this.apollo
        .mutate<any>({
          mutation: CREATE_COMMENT,
          variables: {
            createCommentInput: {
              articleId: commentData.articleId,
              username: commentData.author,
              content: commentData.text
            }
          }
        })
        .pipe(
            map(result => {
              const c = result.data!.createComment;
              return {
                id: c.id,
                articleId: c.articleId,
                author: c.username,
                text: c.content,
                rating: c.rating,
                date: c.createdAt ?
                    new Date(c.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) :
                    new Date().toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
              } as Comment;
            }),
            catchError(error => throwError(() => error)));
  }

  updateArticleRating(id: string, direction: 'up'|'down'): Observable<Article> {
    const mutation =
        direction === 'up' ? ARTICLE_RATING_UP : ARTICLE_RATING_DOWN;

    return this.apollo.mutate<any>({mutation, variables: {id}})
        .pipe(
            map(result => {
              const rawArticle = direction === 'up' ?
                  result.data!.articleRatingUp :
                  result.data!.articleRatingDown;
              return this.mapper.mapToDomain(rawArticle);
            }),
            catchError(error => throwError(() => error)));
  }

  updateCommentRating(id: string, rating: number): Observable<Comment> {
    let isUpvote = true;
    this.store.comments$.pipe(take(1)).subscribe(comments => {
      const currentComment = comments.find(c => c.id === id);
      if (currentComment) {
        isUpvote = rating > currentComment.rating;
      }
    });

    const mutation = isUpvote ? COMMENT_RATING_UP : COMMENT_RATING_DOWN;

    return this.apollo.mutate<any>({mutation, variables: {id}})
        .pipe(
            map(result => {
              const c = isUpvote ? result.data!.commentRatingUp :
                                   result.data!.commentRatingDown;
              return {
                id: c.id,
                articleId: c.articleId,
                author: c.username,
                text: c.content,
                rating: c.rating,
                date: c.createdAt ?
                    new Date(c.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) :
                    new Date().toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
              } as Comment;
            }),
            catchError(error => throwError(() => error)));
  }
}