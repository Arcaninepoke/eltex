import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, switchMap, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';
import {ArticleMapperService} from '../mappers/article-mapper.service';
import {PostServiceInterface} from '../post/post-service.interface';
import {PostStoreService} from '../post/post-store.service';

@Injectable()
export class PostApiHttpService implements PostServiceInterface {
  private store = inject(PostStoreService);
  private http = inject(HttpClient);
  private mapper = inject(ArticleMapperService);
  private apiUrl = environment.apiUrl;

  getPostData(id: string): Observable<Article|null> {
    return this.http.get<any>(`${this.apiUrl}/articles/${id}`)
        .pipe(
            map(dto => this.mapper.mapToDomain(dto)),
            tap(post => this.store.setPost(post)));
  }

  getComments(articleId: string): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comments/article/${articleId}`)
        .pipe(
            map(dtos => dtos.map(
                    dto => this.mapComment(
                        dto))),  // Используем общий метод маппинга
            tap(comments => this.store.setComments(comments)));
  }

  addComment(commentData: Partial<Comment>): Observable<Comment> {
    const body = {
      username: commentData.author,
      content: commentData.text,
      articleId: commentData.articleId
    };

    return this.http.post<any>(`${this.apiUrl}/comments`, body)
        .pipe(map(dto => this.mapComment(dto)));
  }

  updateCommentRating(id: string, rating: number): Observable<Comment> {
    return this.http
        .patch<any>(`${this.apiUrl}/comments/${id}/rating`, {rating})
        .pipe(map(dto => this.mapComment(dto)));
  }

  private mapComment(dto: any): Comment {
    return {
      id: dto.id,
      articleId: dto.articleId,
      author: dto.username,
      text: dto.content,
      rating: dto.rating,
      date: dto.createdAt ?
          new Date(dto.createdAt).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) :
          'только что'
    };
  }

  updateArticleRating(id: string, direction: 'up'|'down'): Observable<Article> {
    return this.http
        .patch<any>(`${this.apiUrl}/articles/${id}/rating-${direction}`, {})
        .pipe(map(dto => this.mapper.mapToDomain(dto)));
  }
}