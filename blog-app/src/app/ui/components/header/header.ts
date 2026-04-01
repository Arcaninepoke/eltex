import {Component} from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected title = 'Title';
  protected link = {
    name: 'Mock Link',
    href: '#',
  }
}
