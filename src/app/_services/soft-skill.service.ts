import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SoftSkillRequest, SoftSkillResponse} from '../_models/soft-skill';

@Injectable({
  providedIn: 'root'
})
export class SoftSkillService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  createSoftSkill(profileId: number, request: SoftSkillRequest): Observable<SoftSkillResponse> {
    return this.http.post<SoftSkillResponse>(
      `${this.apiUrl}/${profileId}/soft-skills`,
      request
    );
  }

  getAllSoftSkills(profileId: number): Observable<SoftSkillResponse[]> {
    return this.http.get<SoftSkillResponse[]>(
      `${this.apiUrl}/${profileId}/soft-skills`
    );
  }

  updateSoftSkill(profileId: number, softSkillId: number, request: SoftSkillRequest): Observable<SoftSkillResponse> {
    return this.http.put<SoftSkillResponse>(
      `${this.apiUrl}/${profileId}/soft-skills/${softSkillId}`,
      request
    );
  }

  deleteSoftSkill(profileId: number, softSkillId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${profileId}/soft-skills/${softSkillId}`
    );
  }
}
