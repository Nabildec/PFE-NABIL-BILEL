import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteroperabiliteComponent } from './interoperabilite.component';

describe('InteroperabiliteComponent', () => {
  let component: InteroperabiliteComponent;
  let fixture: ComponentFixture<InteroperabiliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteroperabiliteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteroperabiliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
