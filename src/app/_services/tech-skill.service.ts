import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TechSkillRequest, TechSkillResponse} from '../_models/tech-skill';

@Injectable({
  providedIn: 'root'
})
export class TechSkillService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  createTechSkill(profileId: number, request: TechSkillRequest): Observable<TechSkillResponse> {
    return this.http.post<TechSkillResponse>(
      `${this.apiUrl}/${profileId}/tech-skills`,
      request
    );
  }

  getAllTechSkills(profileId: number): Observable<TechSkillResponse[]> {
    return this.http.get<TechSkillResponse[]>(
      `${this.apiUrl}/${profileId}/tech-skills`
    );
  }


  updateTechSkill(profileId: number, techSkillId: number, request: TechSkillRequest): Observable<TechSkillResponse> {
    return this.http.put<TechSkillResponse>(
      `${this.apiUrl}/${profileId}/tech-skills/${techSkillId}`,
      request
    );
  }

  deleteTechSkill(profileId: number, techSkillId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${profileId}/tech-skills/${techSkillId}`
    );
  }
}
