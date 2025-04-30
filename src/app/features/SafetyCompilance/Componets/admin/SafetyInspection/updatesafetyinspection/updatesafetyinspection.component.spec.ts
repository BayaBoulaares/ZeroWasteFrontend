import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatesafetyinspectionComponent } from './updatesafetyinspection.component';

describe('UpdatesafetyinspectionComponent', () => {
  let component: UpdatesafetyinspectionComponent;
  let fixture: ComponentFixture<UpdatesafetyinspectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatesafetyinspectionComponent]
    });
    fixture = TestBed.createComponent(UpdatesafetyinspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
