import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotacionPage } from './votacion.page';

describe('VotacionPage', () => {
  let component: VotacionPage;
  let fixture: ComponentFixture<VotacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
