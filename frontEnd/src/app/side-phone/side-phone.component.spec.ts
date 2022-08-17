import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePhoneComponent } from './side-phone.component';

describe('SidePhoneComponent', () => {
  let component: SidePhoneComponent;
  let fixture: ComponentFixture<SidePhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidePhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
