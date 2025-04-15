import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftsComponent } from './employee-shifts.component';

describe('EmployeeShiftsComponent', () => {
  let component: EmployeeShiftsComponent;
  let fixture: ComponentFixture<EmployeeShiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeShiftsComponent]
    });
    fixture = TestBed.createComponent(EmployeeShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
