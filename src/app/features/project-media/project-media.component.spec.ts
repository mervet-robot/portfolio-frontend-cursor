import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMediaComponent } from './project-media.component';

describe('ProjectMediaComponent', () => {
  let component: ProjectMediaComponent;
  let fixture: ComponentFixture<ProjectMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
