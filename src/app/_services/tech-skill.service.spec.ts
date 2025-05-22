import { TestBed } from '@angular/core/testing';

import { TechSkillService } from './tech-skill.service';

describe('TechSkillService', () => {
  let service: TechSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
