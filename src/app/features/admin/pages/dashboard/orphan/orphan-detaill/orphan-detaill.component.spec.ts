import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanDetaillComponent } from './orphan-detaill.component';

describe('OrphanDetaillComponent', () => {
  let component: OrphanDetaillComponent;
  let fixture: ComponentFixture<OrphanDetaillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrphanDetaillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrphanDetaillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
