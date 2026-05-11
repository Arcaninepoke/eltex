import {AsyncPipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import {PostApiHttpService} from '../../services/api/post-api.service';
import {PostServiceInterface} from '../../services/post/post-service.interface';
import {POST_SERVICE_TOKEN} from '../../services/post/post-service.token';
import {PostStoreService} from '../../services/post/post-store.service';
import {PostService} from '../../services/post/post.service';
import {Article} from '../../types/article.interface';
import {CommentFormData} from '../../types/comment-form-data.interface';
import {Comment} from '../../types/comment.interface';
import {CommentCard} from '../../ui/components/comment-card/comment-card';
import {CommentForm} from '../../ui/components/comment-form/comment-form';
import {VoteWidget} from '../../ui/components/vote-widget/vote-widget';

@Component({
  selector: 'app-post-page',
  imports: [
    AsyncPipe, CommentForm, MatCardModule, MatIconModule, MatButtonModule,
    VoteWidget, CommentCard
  ],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  providers: [
    PostStoreService, {
      provide: POST_SERVICE_TOKEN,
      useClass: environment.production ? PostService : PostApiHttpService
    }
  ],
})
export class PostPage implements OnInit {
  protected post$: Observable<Article|null>;
  protected comments$: Observable<Comment[]>;

  constructor(
      private route: ActivatedRoute, private titleService: Title,
      public store: PostStoreService,
      @Inject(POST_SERVICE_TOKEN) private postService: PostServiceInterface) {
    this.post$ = this.store.post$.pipe(tap(post => {
      this.titleService.setTitle(
          post ? `${post.title} | Блог` : 'Загрузка... | Блог');
    }));
    this.comments$ = this.store.comments$;
  }

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');

    if (articleId) {
      this.store.setPost(null);
      this.titleService.setTitle('Загрузка... | Блог');

      this.store.setLoading(true);

      this.postService.getPostData(articleId).subscribe({
        next: () => this.store.setLoading(false),
        error: () => this.store.setLoading(false)
      });

      this.postService.getComments(articleId).subscribe();
    }
  }

  protected onCommentSubmit(formData: CommentFormData) {
    const currentPost = this.store.post;
    if (!currentPost) return;

    this.postService.addComment({...formData, articleId: currentPost.id})
        .subscribe(() => {
          this.postService.getComments(currentPost.id).subscribe();
        });
  }

  protected onArticleVote(value: number) {
    const direction = value === 1 ? 'up' : 'down';
    const currentPost = this.store.post;
    if (currentPost) {
      this.postService.updateArticleRating(currentPost.id, direction)
          .subscribe(() => {
            this.postService.getPostData(currentPost.id).subscribe();
          });
    }
  }

  protected onCommentVote(comment: Comment, voteValue: number) {
    const newRating = (comment.rating || 0) + voteValue;
    this.postService.updateCommentRating(comment.id, newRating)
        .subscribe(() => {
          this.postService.getComments(comment.articleId).subscribe();
        });
  }
}