import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';

import {Article} from '../../types/article.interface';
import {CategoriesApiService} from '../api/categories-api.service';

@Injectable({providedIn: 'root'})
export class ArticlesStoreService {
  private categoriesService = inject(CategoriesApiService);

  private articlesSubject = new BehaviorSubject<Article[]>([]);
  private totalArticlesSubject = new BehaviorSubject<number>(0);
  private limitSubject = new BehaviorSubject<number>(6);

  private rawArticles$ = this.articlesSubject.asObservable();

  public readonly articles$: Observable<Article[]> =
      combineLatest([
        this.rawArticles$, this.categoriesService.categories$
      ]).pipe(map(([articles, categories]) => articles.map(article => {
        const matched = categories.find(c => c.id === article.categoryId);
        return {
          ...article,
          categoryName: matched ? matched.name : 'Без категории'
        };
      })));

  public totalArticles$ = this.totalArticlesSubject.asObservable();
  public limit$ = this.limitSubject.asObservable();

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