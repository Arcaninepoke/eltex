import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Article} from '../../../types/article.interface';

@Component({
  selector: 'app-blog-post-card',
  imports: [],
  templateUrl: './blog-post-card.html',
  styleUrl: './blog-post-card.scss',
})
export class BlogPostCard {
  @Input() article!: Article;

  @Output() deleteClick = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<Article>();

  onDelete() {
    this.deleteClick.emit(this.article.id);
  }

  onEdit() {
    this.editClick.emit(this.article);
  }
}
