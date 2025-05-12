import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidowsComponent } from './widows.component';

describe('WidowsComponent', () => {
  let component: WidowsComponent;
  let fixture: ComponentFixture<WidowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
