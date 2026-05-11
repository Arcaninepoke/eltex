import {Observable} from 'rxjs';

import {Article} from '../../types/article.interface';

export interface ArticlesResponse {
  articles: Article[];
  total: number;
}

export interface ArticlesServiceInterface {
  getArticles(limit: number, page: number): Observable<ArticlesResponse>;
  getArticleById(id: string): Observable<Article|null>;
  addArticle(article: Partial<Article>|FormData): Observable<Article>;
  updateArticle(id: string, article: Partial<Article>|FormData):
      Observable<Article>;
  deleteArticle(id: string): Observable<void>;
}