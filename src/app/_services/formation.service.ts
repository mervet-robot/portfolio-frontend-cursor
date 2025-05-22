import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Formation} from '../_models/formation';

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  createFormation(profileId: number, formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(
      `${this.apiUrl}/${profileId}/formations`,
      formation
    );
  }

  getFormations(profileId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(
      `${this.apiUrl}/${profileId}/formations`
    );
  }

  getFormationById(formationId: number): Observable<Formation> {
    return this.http.get<Formation>(
      `${this.apiUrl}/formations/${formationId}`
    );
  }

  updateFormation(profileId: number, formationId: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(
      `${this.apiUrl}/${profileId}/formations/${formationId}`,
      formation
    );
  }


  deleteFormation(profileId: number, formationId: number): Observable<void> {
    if (!formationId) {
      throw new Error('Formation ID is required');
    }
    return this.http.delete<void>(`${this.apiUrl}/${profileId}/formations/${formationId}`
    );
  }

}
