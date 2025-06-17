import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFeedbackComponent } from './project-feedback.component';

describe('ProjectFeedbackComponent', () => {
  let component: ProjectFeedbackComponent;
  let fixture: ComponentFixture<ProjectFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
