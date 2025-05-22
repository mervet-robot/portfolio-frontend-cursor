import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMediaUploadComponentComponent } from './project-media-upload-component.component';

describe('ProjectMediaUploadComponentComponent', () => {
  let component: ProjectMediaUploadComponentComponent;
  let fixture: ComponentFixture<ProjectMediaUploadComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectMediaUploadComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMediaUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
