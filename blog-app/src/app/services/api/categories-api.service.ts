import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';

import {environment} from '../../../environments/environment';
import {Category} from '../../types/category.interface';

@Injectable({providedIn: 'root'})
export class CategoriesApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  getCategories(): Observable<Category[]> {
    return this.http.get<any[]>(this.apiUrl)
        .pipe(
            map(categories => categories.map(c => ({id: c.id, name: c.name}))),
            tap(categories => this.categoriesSubject.next(categories)));
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<any>(this.apiUrl, {name})
        .pipe(map(c => ({id: c.id, name: c.name})), tap(newCategory => {
                this.categoriesSubject.next(
                    [...this.categoriesSubject.getValue(), newCategory]);
              }));
  }
}