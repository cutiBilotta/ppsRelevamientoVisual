import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelevamientoPage } from './relevamiento.page';

describe('RelevamientoPage', () => {
  let component: RelevamientoPage;
  let fixture: ComponentFixture<RelevamientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevamientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
