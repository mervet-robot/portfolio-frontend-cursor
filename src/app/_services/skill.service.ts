import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Skill} from '../_models/skill';

const API_URL = 'http://localhost:8080/api/skills/';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  constructor(private http: HttpClient) { }

  getSkills(userId: number): Observable<Skill[]> {
    return this.http.get<Skill[]>(API_URL + 'user/' + userId);
  }

  createSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(API_URL, skill);
  }

  updateSkill(id: number, skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(API_URL + id, skill);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(API_URL + id);
  }

  getSkillCategories(): Observable<string[]> {
    return this.http.get<string[]>(API_URL + 'categories');
  }
}
