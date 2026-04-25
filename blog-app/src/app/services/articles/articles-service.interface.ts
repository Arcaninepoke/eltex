import {Observable} from 'rxjs';

import {Article} from '../../types/article.interface';

export interface ArticlesResponse {
  articles: Article[];
  total: number;
}

export interface ArticlesServiceInterface {
  getArticles(limit: number): Observable<ArticlesResponse>;
  addArticle(articleData: any, limit: number): Observable<ArticlesResponse>;
  updateArticle(article: Article, limit: number): Observable<ArticlesResponse>;
  deleteArticle(id: number, limit: number): Observable<ArticlesResponse>;
}