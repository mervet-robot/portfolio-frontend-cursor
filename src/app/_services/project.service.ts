import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ProjectRequest, ProjectResponse, ProjectStatus} from '../_models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) { }

  createProject(profileId: number, request: ProjectRequest): Observable<ProjectResponse> {
    return this.http.post<ProjectResponse>(
      `${this.apiUrl}/profile/${profileId}`,
      request
    );
  }

  getAllProjects(profileId: number): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${this.apiUrl}/profile/${profileId}`
    );
  }

  getProjectById(id: number): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  updateProject(id: number, request: ProjectRequest): Observable<ProjectResponse> {
    return this.http.put<ProjectResponse>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  getProjectsByStatus(profileId: number, status: ProjectStatus): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(
      `${this.apiUrl}/profile/${profileId}/status/${status}`
    );
  }
}
