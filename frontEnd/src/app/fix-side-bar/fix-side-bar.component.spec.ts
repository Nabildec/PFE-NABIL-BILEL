import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixSideBarComponent } from './fix-side-bar.component';

describe('FixSideBarComponent', () => {
  let component: FixSideBarComponent;
  let fixture: ComponentFixture<FixSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixSideBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
