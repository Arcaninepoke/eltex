import {AsyncPipe} from '@angular/common';
import {Component, DestroyRef, Inject, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, Observable, of, switchMap, tap} from 'rxjs';

import {CategoriesApiService} from '../../services/api/categories-api.service';
import {ArticlesServiceInterface} from '../../services/articles/articles-service.interface';
import {ARTICLE_SERVICE_TOKEN} from '../../services/articles/articles-service.token';
import {ArticlesStoreService} from '../../services/articles/articles-store.service';
import {Article} from '../../types/article.interface';
import {Category} from '../../types/category.interface';
import {AdminPanel} from '../../ui/components/admin-panel/admin-panel';
import {ArticleForm} from '../../ui/components/article-form/article-form';
import {BlogPostCard} from '../../ui/components/blog-post-card/blog-post-card';
import {ErrorAlert} from '../../ui/components/error-alert/error-alert';

@Component({
  selector: 'app-blog-page',
  imports: [BlogPostCard, AdminPanel, ArticleForm, AsyncPipe, ErrorAlert],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage implements OnInit {
  protected selectedArticle: Article|null = null;
  protected isFormVisible = false;
  protected totalArticles$: Observable<number>;
  protected serverError = signal<string|null>(null);

  protected articles$: Observable<Article[]>;
  protected categories: Category[] = [];

  private categoriesService = inject(CategoriesApiService);

  private destroyRef = inject(DestroyRef);

  constructor(
      public store: ArticlesStoreService,
      @Inject(ARTICLE_SERVICE_TOKEN) private articlesService:
          ArticlesServiceInterface) {
    this.articles$ = this.store.articles$;
    this.totalArticles$ = this.store.totalArticles$;
  }

  ngOnInit() {
    this.loadArticles();
    this.loadCategories();
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe();
    this.categoriesService.categories$.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(categories => {
          this.categories = categories;
        });
  }

  private loadArticles() {
    this.articlesService.getArticles(this.store.limit, 1).subscribe();
  }

  protected loadMore() {
    const newLimit = this.store.limit + 6;
    this.store.setLimit(newLimit);
    this.loadArticles();
  }

  protected onArticleSubmit(event: {formData: FormData; categoryName: string}) {
    const {formData, categoryName} = event;
    this.serverError.set(null);

    const existingCategory = this.categories.find(
        c => c.name.toLowerCase() === categoryName.toLowerCase());

    const categoryId$ = existingCategory ?
        of(existingCategory.id) :
        this.categoriesService.createCategory(categoryName)
            .pipe(map(category => category.id));

    categoryId$
        .pipe(switchMap(categoryId => {
          if (!categoryId) throw new Error('Category creation failed');
          formData.append('categoryId', categoryId);

          return this.selectedArticle ?
              this.articlesService.updateArticle(
                  this.selectedArticle.id, formData) :
              this.articlesService.addArticle(formData);
        }))
        .subscribe({
          next: () => {
            this.closeForm();
            this.articlesService.getArticles(this.store.limit, 1).subscribe();
          },
          error: (err: any) => {
            this.serverError.set(
                err.status === 500 ?
                    'Статья с таким заголовком уже существует!' :
                    'Произошла ошибка при сохранении.');
          }
        });
  }

  protected onArticleDelete(articleId: string) {
    this.articlesService.deleteArticle(articleId).subscribe(() => {
      this.articlesService.getArticles(this.store.limit, 1).subscribe();
    });
  }

  private scrollToForm() {
    setTimeout(() => {
      document.getElementById('add-article-form-section')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  }

  protected openAddForm() {
    this.selectedArticle = null;
    this.isFormVisible = true;
    this.scrollToForm();
  }

  protected onArticleEdit(article: Article) {
    this.selectedArticle = article;
    this.isFormVisible = true;
    this.scrollToForm();
  }

  protected closeForm() {
    this.isFormVisible = false;
    this.selectedArticle = null;
    this.serverError.set(null);
  }
}