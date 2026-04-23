import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbySection } from './hobby-section';

describe('HobbySection', () => {
  let component: HobbySection;
  let fixture: ComponentFixture<HobbySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HobbySection],
    }).compileComponents();

    fixture = TestBed.createComponent(HobbySection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
