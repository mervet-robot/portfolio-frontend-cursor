import { TestBed } from '@angular/core/testing';

import { ProjectMediaService } from './project-media.service';

describe('ProjectMediaService', () => {
  let service: ProjectMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
