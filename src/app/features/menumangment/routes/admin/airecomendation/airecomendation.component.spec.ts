import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirecomendationComponent } from './airecomendation.component';

describe('AirecomendationComponent', () => {
  let component: AirecomendationComponent;
  let fixture: ComponentFixture<AirecomendationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AirecomendationComponent]
    });
    fixture = TestBed.createComponent(AirecomendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
