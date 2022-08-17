import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistPanneComponent } from './hist-panne.component';

describe('HistPanneComponent', () => {
  let component: HistPanneComponent;
  let fixture: ComponentFixture<HistPanneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistPanneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistPanneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
