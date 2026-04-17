import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-blog-post-card',
  imports: [],
  templateUrl: './blog-post-card.html',
  styleUrl: './blog-post-card.scss',
})
export class BlogPostCard {
  @Input() article!: any;

  @Output() deleteClick = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<any>();

  onDelete() {
    this.deleteClick.emit(this.article.id);
  }

  onEdit() {
    this.editClick.emit(this.article);
  }
}
