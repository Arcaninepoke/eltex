import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';

import {Article} from '../../../types/article.interface';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss'
})
export class ArticleCard {
  public article = input.required<Article>();
}