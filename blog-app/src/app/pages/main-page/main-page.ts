import {Component} from '@angular/core';

import {ArticleCard} from '../../ui/components/article-card/article-card';
import {ArticleForm} from '../../ui/components/article-form/article-form';

@Component({
  selector: 'app-main-page',
  imports: [ArticleCard, ArticleForm],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
}
