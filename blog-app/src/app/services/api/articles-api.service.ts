import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {ArticleDto} from '../../types/article.dto';
import {Article} from '../../types/article.interface';
import {ArticlesResponse, ArticlesServiceInterface} from '../articles/articles-service.interface';
import {ArticlesStoreService} from '../articles/articles-store.service';
import {ArticleMapperService} from '../mappers/article-mapper.service';

@Injectable()
export class ArticlesApiHttpService implements ArticlesServiceInterface {
  private http = inject(HttpClient);
  private mapper = inject(ArticleMapperService);
  private apiUrl = `${environment.apiUrl}/articles`;

  private store = inject(ArticlesStoreService);

  getArticles(limit: number, page: number): Observable<ArticlesResponse> {
    const params = new HttpParams()
                       .set('limit', limit.toString())
                       .set('page', page.toString())
                       .set('cumulative', 'true');

    return this.http.get<any>(this.apiUrl, {params})
        .pipe(
            map(response => {
              const mappedArticles =
                  this.mapper.mapListToDomain(response.items || []);
              const total = response.total || 0;
              return {articles: mappedArticles, total};
            }),
            tap(response => {
              this.store.setArticles(response.articles);
              this.store.setTotalArticles(response.total);
            }));
  }

  getArticleById(id: string): Observable<Article|null> {
    return this.http.get<ArticleDto>(`${this.apiUrl}/${id}`)
        .pipe(map(dto => this.mapper.mapToDomain(dto)));
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addArticle(articleData: Partial<Article>|FormData): Observable<Article> {
    return this.http.post<ArticleDto>(this.apiUrl, articleData)
        .pipe(map(dto => this.mapper.mapToDomain(dto)));
  }

  updateArticle(id: string, articleData: Partial<Article>|FormData):
      Observable<Article> {
    return this.http.patch<ArticleDto>(`${this.apiUrl}/${id}`, articleData)
        .pipe(map(dto => this.mapper.mapToDomain(dto)));
  }
}