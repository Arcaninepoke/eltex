import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostCard } from './blog-post-card';

describe('BlogPostCard', () => {
  let component: BlogPostCard;
  let fixture: ComponentFixture<BlogPostCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
