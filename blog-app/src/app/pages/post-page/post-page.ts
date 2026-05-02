import {AsyncPipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {PostServiceInterface} from '../../services/post/post-service.interface';
import {POST_SERVICE_TOKEN} from '../../services/post/post-service.token';
import {PostStoreService} from '../../services/post/post-store.service';
import {Article} from '../../types/article.interface';
import {Comment} from '../../types/comment.interface';
import {CommentForm} from '../../ui/components/comment-form/comment-form';
import {StarRating} from '../../ui/components/star-rating/star-rating';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [AsyncPipe, CommentForm, MatCardModule, StarRating],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
})
export class PostPage implements OnInit {
  protected post$: Observable<Article|null>;
  protected comments$: Observable<Comment[]>;

  constructor(
      private route: ActivatedRoute, private titleService: Title,
      protected store: PostStoreService,
      @Inject(POST_SERVICE_TOKEN) private postService: PostServiceInterface) {
    this.post$ = this.store.post$.pipe(tap(post => {
      if (post) {
        this.titleService.setTitle(`${post.title} | Блог`);
      } else {
        this.titleService.setTitle('Загрузка... | Блог');
      }
    }));
    this.comments$ = this.store.comments$;
  }

  protected onCommentSubmit(formData: {author: string; text: string}) {
    const currentPost = this.store.post;
    if (!currentPost) return;
    this.postService.addComment({...formData, articleId: currentPost.id})
        .subscribe();
  }

  protected onArticleRatingChange(newRating: number) {
    const currentPost = this.store.post;
    if (currentPost) {
      this.postService.updateArticleRating(currentPost.id, newRating)
          .subscribe();
    }
  }

  protected onCommentRatingChange(commentId: number, newRating: number) {
    this.postService.updateCommentRating(commentId, newRating).subscribe();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const articleId = idParam ? Number(idParam) : 0;
    if (articleId) {
      this.store.setPost(null);
      this.titleService.setTitle('Загрузка... | Блог');
      this.postService.getPostData(articleId).subscribe();
    }
  }
}