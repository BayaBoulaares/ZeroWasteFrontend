import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatemenuComponent } from './updatemenu.component';

describe('UpdatemenuComponent', () => {
  let component: UpdatemenuComponent;
  let fixture: ComponentFixture<UpdatemenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatemenuComponent]
    });
    fixture = TestBed.createComponent(UpdatemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
