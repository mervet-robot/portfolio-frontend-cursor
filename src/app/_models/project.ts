export enum ProjectStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EVALUATED = 'EVALUATED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED'
}

export interface ProjectRequest {
  title: string;
  description: string;
  startDate?: string; // ISO format (YYYY-MM-DD)
  endDate?: string;   // ISO format (YYYY-MM-DD)
  status: ProjectStatus;
  skills: string[];
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  skills: string[];
  profileId: number;
}
