import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Article} from '../../types/article.interface';

@Injectable({providedIn: 'root'})
export class ArticlesStoreService {
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  private totalArticlesSubject = new BehaviorSubject<number>(0);
  private limitSubject = new BehaviorSubject<number>(6);

  public articles$: Observable<Article[]> = this.articlesSubject.asObservable();
  public totalArticles$: Observable<number> =
      this.totalArticlesSubject.asObservable();
  public limit$: Observable<number> = this.limitSubject.asObservable();

  constructor() {}

  setArticles(articles: Article[]): void {
    this.articlesSubject.next(articles);
  }

  setTotalArticles(total: number): void {
    this.totalArticlesSubject.next(total);
  }

  setLimit(limit: number): void {
    this.limitSubject.next(limit);
  }

  get articles(): Article[] {
    return this.articlesSubject.getValue();
  }

  get totalArticles(): number {
    return this.totalArticlesSubject.getValue();
  }

  get limit(): number {
    return this.limitSubject.getValue();
  }
}