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

  private getArticlesFromStorage(): Article[] {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  }

  private getCommentsFromStorage(): Comment[] {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return data ? JSON.parse(data) : [];
  }

  getPostData(id: string): Observable<Article|null> {
    const articles = this.getArticlesFromStorage();
    const post = articles.find(a => a.id === id) || null;

    return of(post).pipe(delay(300), tap(res => this.store.setPost(res)));
  }

  getComments(articleId: string): Observable<Comment[]> {
    const allComments = this.getCommentsFromStorage();
    const postComments = allComments.filter(c => c.articleId === articleId);

    return of(postComments)
        .pipe(delay(300), tap(res => this.store.setComments(res)));
  }

  addComment(commentData: Partial<Comment>): Observable<Comment> {
    const allComments = this.getCommentsFromStorage();
    const now = new Date();
    const newComment: Comment = {
      id: Date.now().toString(),
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

    return of(newComment).pipe(delay(300));
  }

  updateArticleRating(id: string, direction: 'up'|'down'): Observable<Article> {
    const articles = this.getArticlesFromStorage();
    const articleIndex = articles.findIndex(a => a.id === id);

    if (articleIndex !== -1) {
      const currentRating = articles[articleIndex].rating || 0;
      articles[articleIndex].rating =
          direction === 'up' ? currentRating + 1 : currentRating - 1;

      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      return of(articles[articleIndex]).pipe(delay(300));
    }
    throw new Error('Статья не найдена');
  }

  updateCommentRating(id: string, rating: number): Observable<Comment> {
    const allComments = this.getCommentsFromStorage();
    const commentIndex = allComments.findIndex(c => c.id === id);

    if (commentIndex !== -1) {
      allComments[commentIndex].rating = rating;
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
      return of(allComments[commentIndex]).pipe(delay(300));
    }
    throw new Error('Комментарий не найден');
  }
}