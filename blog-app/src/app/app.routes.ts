import {Routes} from '@angular/router';

import {BlogPage} from './pages/blog-page/blog-page';
import {MainPage} from './pages/main-page/main-page';
import {PostPage} from './pages/post-page/post-page';

export const routes: Routes = [
  {path: '', component: MainPage, title: 'Главная'},
  {path: 'blog', component: BlogPage, title: 'Блог'},
  {path: 'blog/:id', component: PostPage},
];