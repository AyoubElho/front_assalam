import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrphanCreateComponent } from './orphan-create.component';

describe('OrphanCreateComponent', () => {
  let component: OrphanCreateComponent;
  let fixture: ComponentFixture<OrphanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrphanCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrphanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
