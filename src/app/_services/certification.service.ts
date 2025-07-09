import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CertificationRequest, CertificationResponse} from '../_models/certification';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private apiUrl = 'http://localhost:8080/api/certifications';

  constructor(private http: HttpClient) { }

  createCertification(profileId: number, request: CertificationRequest): Observable<CertificationResponse> {
    return this.http.post<CertificationResponse>(
      `${this.apiUrl}/profile/${profileId}`,
      request
    );
  }

  getAllCertifications(profileId: number): Observable<CertificationResponse[]> {
    return this.http.get<CertificationResponse[]>(
      `${this.apiUrl}/profile/${profileId}`
    );
  }

  getCertificationById(id: number): Observable<CertificationResponse> {
    return this.http.get<CertificationResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  updateCertification(id: number, request: CertificationRequest): Observable<CertificationResponse> {
    return this.http.put<CertificationResponse>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deleteCertification(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  createCertificationFromMedia(userId: number, certifMediaId: number): Observable<CertificationResponse> {
    return this.http.post<CertificationResponse>(
      `${this.apiUrl}/from-media/user/${userId}/media/${certifMediaId}`, {}
    );
  }
}
