import {AsyncPipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs';

import {ArticlesServiceInterface} from '../../services/articles/articles-service.interface';
import {ARTICLE_SERVICE_TOKEN} from '../../services/articles/articles-service.token';
import {ArticlesStoreService} from '../../services/articles/articles-store.service';
import {Article} from '../../types/article.interface';
import {AdminPanel} from '../../ui/components/admin-panel/admin-panel';
import {ArticleForm} from '../../ui/components/article-form/article-form';
import {BlogPostCard} from '../../ui/components/blog-post-card/blog-post-card';

@Component({
  selector: 'app-blog-page',
  imports: [BlogPostCard, AdminPanel, ArticleForm, AsyncPipe],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage implements OnInit {
  protected selectedArticle: Article|null = null;
  protected isFormVisible = false;
  protected totalArticles$: Observable<number>;

  protected articles$: Observable<Article[]>;

  constructor(
      public store: ArticlesStoreService,
      @Inject(ARTICLE_SERVICE_TOKEN) private articlesService:
          ArticlesServiceInterface, private titleService: Title) {
    this.articles$ = this.store.articles$;
    this.totalArticles$ = this.store.totalArticles$;
  }

  ngOnInit() {
    this.loadArticles();
    this.titleService.setTitle('Блог');
  }

  private loadArticles() {
    const currentLimit = this.store.limit;
    this.articlesService.getArticles(currentLimit).subscribe();
  }

  protected loadMore() {
    const newLimit = this.store.limit + 6;
    this.store.setLimit(newLimit);
    this.loadArticles();
  }

  protected onArticleSubmit(formData: {title: string; content: string}) {
    if (this.selectedArticle) {
      const updatedArticle: Article = {
        ...this.selectedArticle,
        title: formData.title,
        content: formData.content
      };

      this.articlesService.updateArticle(updatedArticle, this.store.limit)
          .subscribe(() => {
            this.closeForm();
          });

    } else {
      this.articlesService.addArticle(formData, this.store.limit)
          .subscribe(() => {
            this.closeForm();
          });
    }
  }

  protected onArticleDelete(articleId: number) {
    this.articlesService.deleteArticle(articleId, this.store.limit)
        .subscribe(() => {
          if (this.selectedArticle?.id === articleId) {
            this.closeForm();
          }
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
  }
}
