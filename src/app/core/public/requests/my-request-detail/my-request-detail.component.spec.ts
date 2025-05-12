import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestDetailComponent } from './my-request-detail.component';

describe('MyRequestDetailComponent', () => {
  let component: MyRequestDetailComponent;
  let fixture: ComponentFixture<MyRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRequestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
