import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusectionComponent } from './menusection.component';

describe('MenusectionComponent', () => {
  let component: MenusectionComponent;
  let fixture: ComponentFixture<MenusectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusectionComponent]
    });
    fixture = TestBed.createComponent(MenusectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
