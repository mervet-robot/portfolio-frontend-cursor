import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectSubmitRequest, ProjectSubmitResponse } from '../_models/project-submit';
import { ProjectSubmitStatus } from '../_models/project-submit-status.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectSubmitService {
  private apiUrl = 'http://localhost:8080/api/project-submits';

  constructor(private http: HttpClient) { }

  submitProject(profileId: number, request: ProjectSubmitRequest): Observable<ProjectSubmitResponse> {
    return this.http.post<ProjectSubmitResponse>(
      `${this.apiUrl}/apprenant/${profileId}`,
      request
    );
  }

  getSubmittedProjects(): Observable<ProjectSubmitResponse[]> {
    return this.http.get<ProjectSubmitResponse[]>(`${this.apiUrl}/submitted`);
  }

  getProjectSubmits(userId: number): Observable<ProjectSubmitResponse[]> {
    return this.http.get<ProjectSubmitResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  getProjectSubmit(id: number): Observable<ProjectSubmitResponse> {
    return this.http.get<ProjectSubmitResponse>(`${this.apiUrl}/${id}`);
  }

  reviewProject(projectId: number, status: ProjectSubmitStatus): Observable<ProjectSubmitResponse> {
    return this.http.patch<ProjectSubmitResponse>(
      `${this.apiUrl}/${projectId}/review`,
      { status }
    );
  }

  deleteProjectSubmit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
