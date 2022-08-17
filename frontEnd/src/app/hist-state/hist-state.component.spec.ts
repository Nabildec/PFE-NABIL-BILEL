import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistStateComponent } from './hist-state.component';

describe('HistStateComponent', () => {
  let component: HistStateComponent;
  let fixture: ComponentFixture<HistStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
