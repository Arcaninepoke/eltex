import {Observable} from 'rxjs';

import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';

export interface PostDataResponse {
  post: Article|null;
  comments: Comment[];
}

export interface PostServiceInterface {
  getPostData(articleId: number): Observable<PostDataResponse>;
  addComment(commentData: Partial<Comment>): Observable<Comment[]>;
  updateCommentRating(commentId: number, rating: number): Observable<Comment[]>;
  updateArticleRating(articleId: number, rating: number):
      Observable<Article|null>;
}