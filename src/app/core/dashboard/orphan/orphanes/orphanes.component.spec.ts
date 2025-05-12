import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanesComponent } from './orphanes.component';

describe('OrphanesComponent', () => {
  let component: OrphanesComponent;
  let fixture: ComponentFixture<OrphanesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrphanesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrphanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
