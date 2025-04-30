import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontinspectionComponent } from './frontinspection.component';

describe('FrontinspectionComponent', () => {
  let component: FrontinspectionComponent;
  let fixture: ComponentFixture<FrontinspectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontinspectionComponent]
    });
    fixture = TestBed.createComponent(FrontinspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
