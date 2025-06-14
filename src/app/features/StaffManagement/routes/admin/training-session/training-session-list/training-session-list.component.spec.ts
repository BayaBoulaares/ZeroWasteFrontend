import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSessionListComponent } from './training-session-list.component';

describe('TrainingSessionListComponent', () => {
  let component: TrainingSessionListComponent;
  let fixture: ComponentFixture<TrainingSessionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingSessionListComponent]
    });
    fixture = TestBed.createComponent(TrainingSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
