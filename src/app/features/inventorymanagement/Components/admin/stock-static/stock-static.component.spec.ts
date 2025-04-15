import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStaticComponent } from './stock-static.component';

describe('StockStaticComponent', () => {
  let component: StockStaticComponent;
  let fixture: ComponentFixture<StockStaticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockStaticComponent]
    });
    fixture = TestBed.createComponent(StockStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
