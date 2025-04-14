import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIngredientComponent } from './update-ingredient.component';

describe('UpdateIngredientComponent', () => {
  let component: UpdateIngredientComponent;
  let fixture: ComponentFixture<UpdateIngredientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateIngredientComponent]
    });
    fixture = TestBed.createComponent(UpdateIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
