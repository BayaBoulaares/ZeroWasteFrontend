import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductComponent } from './inventory-product.component';

describe('InventoryProductComponent', () => {
  let component: InventoryProductComponent;
  let fixture: ComponentFixture<InventoryProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryProductComponent]
    });
    fixture = TestBed.createComponent(InventoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
