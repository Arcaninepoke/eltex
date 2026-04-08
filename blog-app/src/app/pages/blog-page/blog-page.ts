import {Component} from '@angular/core';

import {BlogPostCard} from '../../ui/components/blog-post-card/blog-post-card';

@Component({
  selector: 'app-blog-page',
  imports: [BlogPostCard],
  templateUrl: './blog-page.html',
  styleUrl: './blog-page.scss',
})
export class BlogPage {
}
