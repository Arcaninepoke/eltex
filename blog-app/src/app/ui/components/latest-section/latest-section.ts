import {AsyncPipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ArticlesServiceInterface} from '../../../services/articles/articles-service.interface';
import {ARTICLE_SERVICE_TOKEN} from '../../../services/articles/articles-service.token';
import {ArticlesStoreService} from '../../../services/articles/articles-store.service';
import {Article} from '../../../types/article.interface';

@Component({
  selector: 'app-latest-section',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './latest-section.html',
  styleUrl: './latest-section.scss',
})
export class LatestSection implements OnInit {
  latestArticles$: Observable<Article[]>;

  constructor(
      private store: ArticlesStoreService,
      @Inject(ARTICLE_SERVICE_TOKEN) private articlesService:
          ArticlesServiceInterface) {
    this.latestArticles$ =
        this.store.articles$.pipe(map(articles => articles.slice(0, 2)));
  }

  ngOnInit(): void {
    this.articlesService.getArticles(2).subscribe();
  }
}