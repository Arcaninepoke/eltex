import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

import {STORAGE_KEYS} from '../../constants';
import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';

import {PostDataResponse, PostServiceInterface} from './post-service.interface';
import {PostStoreService} from './post-store.service';

@Injectable()
export class PostService implements PostServiceInterface {
  constructor(private store: PostStoreService) {}

  private getArticles(): Article[] {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  }

  private getComments(): Comment[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return data ? JSON.parse(data) : [];
  }

  getPostData(articleId: number): Observable<PostDataResponse> {
    const articles = this.getArticles();
    const post = articles.find(a => a.id === articleId) || null;

    const allComments = this.getComments();
    const postComments = allComments.filter(c => c.articleId === articleId);

    const response: PostDataResponse = {post, comments: postComments};

    return of(response).pipe(delay(1000), tap(res => {
                               this.store.setPost(res.post);
                               this.store.setComments(res.comments);
                             }));
  }

  addComment(commentData: Partial<Comment>): Observable<Comment[]> {
    const allComments = this.getComments();
    const now = new Date();
    const newComment: Comment = {
      id: Date.now(),
      articleId: commentData.articleId!,
      author: commentData.author!,
      text: commentData.text!,
      date: `${now.getDate().toString().padStart(2, '0')}.${
          (now.getMonth() + 1).toString().padStart(2, '0')}.${
          now.getFullYear()}`,
      rating: 0
    };

    allComments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    const postComments =
        allComments.filter(c => c.articleId === commentData.articleId);

    return of(postComments)
        .pipe(delay(1000), tap(comments => this.store.setComments(comments)));
  }

  updateArticleRating(articleId: number, rating: number):
      Observable<Article|null> {
    const articles = this.getArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex !== -1) {
      articles[articleIndex].rating = rating;
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      this.store.setPost(articles[articleIndex]);
      return of(articles[articleIndex]);
    }
    return of(null);
  }

  updateCommentRating(commentId: number, rating: number):
      Observable<Comment[]> {
    const allComments = this.getComments();
    const commentIndex = allComments.findIndex(c => c.id === commentId);

    if (commentIndex !== -1) {
      allComments[commentIndex].rating = rating;
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
      const currentArticleId = allComments[commentIndex].articleId;
      const postComments =
          allComments.filter(c => c.articleId === currentArticleId);
      this.store.setComments(postComments);
      return of(postComments);
    }
    return of([]);
  }
}