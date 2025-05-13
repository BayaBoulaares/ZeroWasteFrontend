import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiapiComponent } from './geminiapi.component';

describe('GeminiapiComponent', () => {
  let component: GeminiapiComponent;
  let fixture: ComponentFixture<GeminiapiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeminiapiComponent]
    });
    fixture = TestBed.createComponent(GeminiapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
