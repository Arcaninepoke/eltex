import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

import {STORAGE_KEYS} from '../../constants';
import {Article} from '../../types/article.interface';

import {ArticlesResponse, ArticlesServiceInterface} from './articles-service.interface';
import {ArticlesStoreService} from './articles-store.service';

@Injectable()
export class ArticlesService implements ArticlesServiceInterface {
  constructor(private store: ArticlesStoreService) {}

  private getAllFromStorage(): Article[] {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(articles: Article[]): void {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }

  private createResponse(limit: number): ArticlesResponse {
    const allArticles = this.getAllFromStorage();
    return {articles: allArticles.slice(0, limit), total: allArticles.length};
  }

  // пуллим данные
  getArticles(limit: number): Observable<ArticlesResponse> {
    // проверяем хранилище перед запросом
    const storeArticles = this.store.articles;
    const storeTotal = this.store.totalArticles;

    if (storeArticles.length === limit && storeTotal > 0) {
      return of({articles: storeArticles, total: storeTotal});
    }
    return of(this.createResponse(limit)).pipe(delay(300), tap(response => {
                                                 this.store.setArticles(
                                                     response.articles);
                                                 this.store.setTotalArticles(
                                                     response.total);
                                               }));
  }

  // добавление статьи
  addArticle(articleData: any, limit: number): Observable<ArticlesResponse> {
    const allArticles = this.getAllFromStorage();
    const now = new Date();
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа',
      'сентября', 'октября', 'ноября', 'декабря'
    ];

    const newArticle: Article = {
      id: Date.now(),
      title: articleData.title,
      content: articleData.content,
      image: 'images/photos/placeholder.jpg',
      alt: 'Новая статья',
      date: `${now.getFullYear()}-${
          String(now.getMonth() + 1).padStart(2, '0')}-${
          String(now.getDate()).padStart(2, '0')}`,
      displayDate:
          `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    };

    allArticles.unshift(newArticle);
    this.saveToStorage(allArticles);

    return of(this.createResponse(limit)).pipe(delay(300), tap(response => {
                                                 this.store.setArticles(
                                                     response.articles);
                                                 this.store.setTotalArticles(
                                                     response.total);
                                               }));
  }

  // изменение статьи
  updateArticle(updatedArticle: Article, limit: number):
      Observable<ArticlesResponse> {
    const allArticles = this.getAllFromStorage();
    const index = allArticles.findIndex(a => a.id === updatedArticle.id);

    if (index !== -1) {
      allArticles[index] = updatedArticle;
      this.saveToStorage(allArticles);
    }

    return of(this.createResponse(limit)).pipe(delay(300), tap(response => {
                                                 this.store.setArticles(
                                                     response.articles);
                                                 this.store.setTotalArticles(
                                                     response.total);
                                               }));
  }

  // удаление статьи
  deleteArticle(id: number, limit: number): Observable<ArticlesResponse> {
    let allArticles = this.getAllFromStorage();
    allArticles = allArticles.filter(a => a.id !== id);
    this.saveToStorage(allArticles);

    return of(this.createResponse(limit)).pipe(delay(300), tap(response => {
                                                 this.store.setArticles(
                                                     response.articles);
                                                 this.store.setTotalArticles(
                                                     response.total);
                                               }));
  }
}