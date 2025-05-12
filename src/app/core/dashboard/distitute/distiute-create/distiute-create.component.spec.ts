import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistiuteCreateComponent } from './distiute-create.component';

describe('DistiuteCreateComponent', () => {
  let component: DistiuteCreateComponent;
  let fixture: ComponentFixture<DistiuteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistiuteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistiuteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
