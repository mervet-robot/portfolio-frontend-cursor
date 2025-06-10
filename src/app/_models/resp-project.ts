import { ProjectStatus } from './project';

export interface RespProjectRequest {
  title: string;
  description: string;
  startDate?: string; // ISO format (YYYY-MM-DD)
  endDate?: string;   // ISO format (YYYY-MM-DD)
  status: ProjectStatus;
  skills: string[];
}

export interface RespProjectResponse {
  id: number;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  skills: string[];
  responsableId: number;
} 