import {Observable} from 'rxjs';

import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';

export interface PostDataResponse {
  post: Article|null;
  comments: Comment[];
}

export interface PostServiceInterface {
  getPostData(id: string): Observable<Article|null>;
  getComments(articleId: string): Observable<Comment[]>;
  addComment(commentData: Partial<Comment>): Observable<Comment>;
  updateArticleRating(id: string, direction: 'up'|'down'): Observable<Article>;
  updateCommentRating(id: string, rating: number): Observable<Comment>;
}