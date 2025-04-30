import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInspectionComponent } from './details-inspection.component';

describe('DetailsInspectionComponent', () => {
  let component: DetailsInspectionComponent;
  let fixture: ComponentFixture<DetailsInspectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsInspectionComponent]
    });
    fixture = TestBed.createComponent(DetailsInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
