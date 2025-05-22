export enum CertificationType {
  None ='None',
  TOEFL = 'TOEFL',
  IELTS = 'IELTS',
  DELE = 'DELE',
  DALF = 'DALF',
  JLPT = 'JLPT',
  HSK = 'HSK',
  OTHER = 'OTHER'
}

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  FLUENT = 'FLUENT',
  NATIVE = 'NATIVE'
}

export interface LanguageRequest {
  name: string;
  proficiency: ProficiencyLevel;
  certification?: CertificationType;
  certificateUrl?: string;
  nativeLanguage: boolean;
}

export interface LanguageResponse {
  id: number;
  name: string;
  proficiency: ProficiencyLevel;
  certification?: CertificationType;
  certificateUrl?: string;
  nativeLanguage: boolean;
  profileId: number;
}
