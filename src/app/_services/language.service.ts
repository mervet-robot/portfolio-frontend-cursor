import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LanguageRequest, LanguageResponse} from '../_models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) { }

  createLanguage(profileId: number, request: LanguageRequest): Observable<LanguageResponse> {
    return this.http.post<LanguageResponse>(
      `${this.apiUrl}/${profileId}/languages`,
      request
    );
  }

  getLanguages(profileId: number): Observable<LanguageResponse[]> {
    return this.http.get<LanguageResponse[]>(
      `${this.apiUrl}/${profileId}/languages`
    );
  }

  getLanguageById(profileId: number, languageId: number): Observable<LanguageResponse> {
    return this.http.get<LanguageResponse>(
      `${this.apiUrl}/${profileId}/languages/${languageId}`
    );
  }

  updateLanguage(profileId: number, languageId: number, request: LanguageRequest): Observable<LanguageResponse> {
    return this.http.put<LanguageResponse>(
      `${this.apiUrl}/${profileId}/languages/${languageId}`,
      request
    );
  }

  deleteLanguage(profileId: number, languageId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${profileId}/languages/${languageId}`
    );
  }
}
