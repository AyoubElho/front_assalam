import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetaillComponent } from './post-detaill.component';

describe('PostDetaillComponent', () => {
  let component: PostDetaillComponent;
  let fixture: ComponentFixture<PostDetaillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetaillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDetaillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
