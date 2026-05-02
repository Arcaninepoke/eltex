import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  imports: [MatIconModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
})

export class StarRating {
  public rating = input<number>(0);
  @Output() public ratingChange = new EventEmitter<number>();
  protected stars = [1, 2, 3, 4, 5];
  protected hoverState = 0;

  protected getIcon(starIndex: number): string {
    const currentRating = this.hoverState || this.rating();
    return starIndex <= currentRating ? 'star' : 'star_border';
  }

  protected rate(newRating: number) {
    this.ratingChange.emit(newRating);
  }
}
