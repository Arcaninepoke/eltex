import {Component, input} from '@angular/core';

@Component({
  selector: 'app-error-alert',
  imports: [],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.scss'
})
export class ErrorAlert {
  public message = input.required<string>();
}