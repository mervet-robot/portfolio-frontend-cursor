export interface Formation {
  id: number;
  profileId: number;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  location?: string;
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;
  current: boolean;
  grade?: string;
  activities?: string;
  diplomaUrl?: string;
}
