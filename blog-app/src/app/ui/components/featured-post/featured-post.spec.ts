import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedPost } from './featured-post';

describe('FeaturedPost', () => {
  let component: FeaturedPost;
  let fixture: ComponentFixture<FeaturedPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedPost],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedPost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
