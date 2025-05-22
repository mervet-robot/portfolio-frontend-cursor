export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface TechSkillRequest {
  name: string;
  level: SkillLevel;
  category: string;
  yearsOfExperience: number;
  verified: boolean;
}

export interface TechSkillResponse {
  id: number;
  name: string;
  level: SkillLevel;
  category: string;
  yearsOfExperience: number;
  verified: boolean;
  profileId: number;
}
