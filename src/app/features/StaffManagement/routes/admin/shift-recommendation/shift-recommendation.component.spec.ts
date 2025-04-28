import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftRecommendationComponent } from './shift-recommendation.component';

describe('ShiftRecommendationComponent', () => {
  let component: ShiftRecommendationComponent;
  let fixture: ComponentFixture<ShiftRecommendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftRecommendationComponent]
    });
    fixture = TestBed.createComponent(ShiftRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
