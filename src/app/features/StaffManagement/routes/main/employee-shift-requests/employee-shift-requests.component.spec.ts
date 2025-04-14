import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftRequestsComponent } from './employee-shift-requests.component';

describe('EmployeeShiftRequestsComponent', () => {
  let component: EmployeeShiftRequestsComponent;
  let fixture: ComponentFixture<EmployeeShiftRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeShiftRequestsComponent]
    });
    fixture = TestBed.createComponent(EmployeeShiftRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
