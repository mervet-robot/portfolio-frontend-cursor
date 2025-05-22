import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Experience} from '../_models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  createExperience(profileId: number, experience: Experience): Observable<Experience> {
    return this.http.post<Experience>(
      `${this.apiUrl}/${profileId}/experiences`,
      experience
    );
  }

  getExperiences(profileId: number): Observable<Experience[]> {
    return this.http.get<Experience[]>(
      `${this.apiUrl}/${profileId}/experiences`
    );
  }

  getExperienceById(experienceId: number): Observable<Experience> {
    return this.http.get<Experience>(
      `${this.apiUrl}/experiences/${experienceId}`
    );
  }

  updateExperience(profileId: number,experienceId: number, experience: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(
      `${this.apiUrl}/${profileId}/experiences/${experienceId}`,
      experience
    );
  }


  deleteExperience(profileId: number, experienceId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${profileId}/experiences/${experienceId}`
    );
  }

}
