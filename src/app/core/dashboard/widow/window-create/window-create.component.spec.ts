import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowCreateComponent } from './window-create.component';

describe('WindowCreateComponent', () => {
  let component: WindowCreateComponent;
  let fixture: ComponentFixture<WindowCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
