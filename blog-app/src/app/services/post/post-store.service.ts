import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';

@Injectable()
export class PostStoreService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoadingSubject.asObservable();

  setLoading(value: boolean): void {
    this.isLoadingSubject.next(value);
  }
  private postSubject = new BehaviorSubject<Article|null>(null);
  public readonly post$: Observable<Article|null> =
      this.postSubject.asObservable();
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  public readonly comments$: Observable<Comment[]> =
      this.commentsSubject.asObservable();

  setPost(post: Article|null): void {
    this.postSubject.next(post);
  }

  setComments(comments: Comment[]): void {
    this.commentsSubject.next(comments);
  }

  get post(): Article|null {
    return this.postSubject.getValue();
  }

  get comments(): Comment[] {
    return this.commentsSubject.getValue();
  }

  get isLoading(): boolean {
    return this.isLoadingSubject.getValue();
  }
}