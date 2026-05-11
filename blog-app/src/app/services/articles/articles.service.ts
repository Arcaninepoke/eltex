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

  private createResponse(limit: number, page: number): ArticlesResponse {
    const allArticles = this.getAllFromStorage();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      articles: allArticles.slice(startIndex, endIndex),
      total: allArticles.length
    };
  }

  // 1. Получение спискф
  getArticles(limit: number, page: number): Observable<ArticlesResponse> {
    return of(this.createResponse(limit, page))
        .pipe(delay(300), tap(response => {
                this.store.setArticles(response.articles);
                this.store.setTotalArticles(response.total);
              }));
  }

  // 2. Получение одной статьи
  getArticleById(id: string): Observable<Article|null> {
    const allArticles = this.getAllFromStorage();
    const article = allArticles.find(a => a.id === id) || null;
    return of(article).pipe(delay(300));
  }

  // 3. Добавление
  addArticle(articleData: Partial<Article>|FormData): Observable<Article> {
    const allArticles = this.getAllFromStorage();
    const now = new Date();
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа',
      'сентября', 'октября', 'ноября', 'декабря'
    ];

    const title = articleData instanceof FormData ?
        articleData.get('title') as string :
        articleData.title;
    const content = articleData instanceof FormData ?
        articleData.get('content') as string :
        articleData.content;

    const newArticle: Article = {
      id: Date.now().toString(),
      title: title || 'Без заголовка',
      content: content || '',
      image: 'images/photos/placeholder.jpg',
      alt: title || 'Новая статья',
      rating: 0,
      date: now.toISOString(),
      displayDate:
          `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    };

    allArticles.unshift(newArticle);
    this.saveToStorage(allArticles);
    return of(newArticle).pipe(delay(300));
  }

  // 4. Обновление
  updateArticle(id: string, articleData: Partial<Article>|FormData):
      Observable<Article> {
    const allArticles = this.getAllFromStorage();
    const index = allArticles.findIndex(a => a.id === id);

    if (index !== -1) {
      const title = articleData instanceof FormData ?
          articleData.get('title') as string :
          articleData.title;
      const content = articleData instanceof FormData ?
          articleData.get('content') as string :
          articleData.content;
      allArticles[index] = {
        ...allArticles[index],
        title: title || allArticles[index].title,
        content: content || allArticles[index].content
      };

      this.saveToStorage(allArticles);
      return of(allArticles[index]).pipe(delay(300));
    }
    throw new Error('Статья не найдена');
  }

  // 5. Удаление
  deleteArticle(id: string): Observable<void> {
    let allArticles = this.getAllFromStorage();
    allArticles = allArticles.filter(a => a.id !== id);
    this.saveToStorage(allArticles);
    return of(undefined).pipe(delay(300));
  }
}