import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerSection } from './career-section';

describe('CareerSection', () => {
  let component: CareerSection;
  let fixture: ComponentFixture<CareerSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CareerSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
