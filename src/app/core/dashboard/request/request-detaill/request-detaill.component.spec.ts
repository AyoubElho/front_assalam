import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDetaillComponent } from './request-detaill.component';

describe('RequestDetaillComponent', () => {
  let component: RequestDetaillComponent;
  let fixture: ComponentFixture<RequestDetaillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDetaillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDetaillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
