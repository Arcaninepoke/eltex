import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-vote-widget',
  imports: [MatIconButton, MatIcon],
  templateUrl: './vote-widget.html',
  styleUrl: './vote-widget.scss'
})
export class VoteWidget {
  public rating = input.required<number>();
  public size = input<'normal'|'small'>('normal');
  @Output() vote = new EventEmitter<number>();

  protected onVote(value: number) {
    this.vote.emit(value);
  }
}