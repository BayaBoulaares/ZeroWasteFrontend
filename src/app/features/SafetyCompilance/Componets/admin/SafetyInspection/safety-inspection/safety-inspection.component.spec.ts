import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInspectionComponent } from './safety-inspection.component';

describe('SafetyInspectionComponent', () => {
  let component: SafetyInspectionComponent;
  let fixture: ComponentFixture<SafetyInspectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyInspectionComponent]
    });
    fixture = TestBed.createComponent(SafetyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
