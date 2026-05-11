import {Component, EventEmitter, input, Output} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

import {Comment} from '../../../types/comment.interface';
import {VoteWidget} from '../vote-widget/vote-widget';

@Component({
  selector: 'app-comment-card',
  imports: [MatCardModule, VoteWidget],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.scss'
})
export class CommentCard {
  public comment = input.required<Comment>();

  @Output() vote = new EventEmitter<number>();

  protected onVote(value: number) {
    this.vote.emit(value);
  }
}