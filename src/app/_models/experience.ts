export interface Experience {
  id: number;
  profileId: number;
  title: string;
  company: string;
  location?: string;
  description?: string;
  startDate: Date | string;
  endDate?: Date | string;
  current?: boolean;
}
