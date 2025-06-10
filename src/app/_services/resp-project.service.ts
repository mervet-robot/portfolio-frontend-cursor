import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectStatus } from '../_models/project';
import { RespProjectRequest, RespProjectResponse } from '../_models/resp-project';

@Injectable({
  providedIn: 'root'
})
export class RespProjectService {
  private apiUrl = 'http://localhost:8080/api/resp-projects';

  constructor(private http: HttpClient) { }

  createProject(responsableId: number, request: RespProjectRequest): Observable<RespProjectResponse> {
    return this.http.post<RespProjectResponse>(
      `${this.apiUrl}/responsable/${responsableId}`,
      request
    );
  }

  getAllProjects(responsableId: number): Observable<RespProjectResponse[]> {
    return this.http.get<RespProjectResponse[]>(
      `${this.apiUrl}/responsable/${responsableId}`
    );
  }

  getProjectById(id: number): Observable<RespProjectResponse> {
    return this.http.get<RespProjectResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  updateProject(id: number, request: RespProjectRequest): Observable<RespProjectResponse> {
    return this.http.put<RespProjectResponse>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  getProjectsByStatus(responsableId: number, status: ProjectStatus): Observable<RespProjectResponse[]> {
    return this.http.get<RespProjectResponse[]>(
      `${this.apiUrl}/responsable/${responsableId}/status/${status}`
    );
  }
} 