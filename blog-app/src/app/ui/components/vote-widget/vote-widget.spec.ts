import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteWidget } from './vote-widget';

describe('VoteWidget', () => {
  let component: VoteWidget;
  let fixture: ComponentFixture<VoteWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
