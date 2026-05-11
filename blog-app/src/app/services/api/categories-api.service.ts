import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {STORAGE_KEYS} from '../../constants';
import {Category} from '../../types/category.interface';

@Injectable({providedIn: 'root'})
export class CategoriesApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  private categoriesSubject =
      new BehaviorSubject<Category[]>(this.loadFromStorage());
  public categories$ = this.categoriesSubject.asObservable();

  private loadFromStorage(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  getCategories(): Observable<Category[]> {
    if (environment.production) {
      const categories = this.loadFromStorage();
      this.categoriesSubject.next(categories);
      return of(categories);
    }

    return this.http.get<any[]>(this.apiUrl)
        .pipe(
            map(items => items.map(c => ({id: c.id, name: c.name}))),
            tap(categories => {
              this.saveToStorage(categories);
              this.categoriesSubject.next(categories);
            }));
  }

  createCategory(name: string): Observable<Category> {
    if (environment.production) {
      const newCategory: Category = {id: Date.now().toString(), name};
      const updated = [...this.categoriesSubject.getValue(), newCategory];
      this.saveToStorage(updated);
      this.categoriesSubject.next(updated);
      return of(newCategory);
    }

    return this.http.post<any>(this.apiUrl, {name})
        .pipe(map(c => ({id: c.id, name: c.name})), tap(newCategory => {
                const updated =
                    [...this.categoriesSubject.getValue(), newCategory];
                this.categoriesSubject.next(updated);
              }));
  }
}