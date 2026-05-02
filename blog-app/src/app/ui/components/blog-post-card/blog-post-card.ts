import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

import {Article} from '../../../types/article.interface';

@Component({
  selector: 'app-blog-post-card',
  imports: [RouterLink, MatIconButton, MatIconModule],
  templateUrl: './blog-post-card.html',
  styleUrl: './blog-post-card.scss',
})
export class BlogPostCard {
  public article = input.required<Article>();

  @Output() public deleteClick = new EventEmitter<number>();
  @Output() public editClick = new EventEmitter<Article>();

  protected onEdit() {
    this.editClick.emit(this.article());
  }

  protected onDelete() {
    this.deleteClick.emit(this.article().id);
  }
}
