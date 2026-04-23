import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestSection } from './latest-section';

describe('LatestSection', () => {
  let component: LatestSection;
  let fixture: ComponentFixture<LatestSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestSection],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
