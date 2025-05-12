import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistitutesComponent } from './distitutes.component';

describe('DistitutesComponent', () => {
  let component: DistitutesComponent;
  let fixture: ComponentFixture<DistitutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistitutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistitutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
