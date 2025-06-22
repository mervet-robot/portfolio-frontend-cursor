import { ProjectSubmitStatus } from "./project-submit-status.enum";

export interface ProjectSubmitRequest {
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  skills?: string[];
}

export interface ProjectSubmitResponse {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectSubmitStatus;
  skills: string[];
  profileId: number;
  projectId?: number;
}
