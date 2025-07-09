import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MediaType, CertifMedia} from '../_models/certif-media';


@Injectable({
  providedIn: 'root'
})
export class CertifMediaService {
  private apiUrl  = 'http://localhost:8080/api/certif-media';

  constructor(private http: HttpClient) { }

  uploadCertifMedia(username: string, file: File, mediaType: MediaType, titre: string, description: string, category: string, verified: boolean): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType.toString());
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('verified', verified.toString());

    const req = new HttpRequest('POST', `${this.apiUrl}/${username}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }


  getCertifMedia(username: string): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/${username}`);
  }

  getCertifMediaByType(username: string, mediaType: MediaType): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/${username}/type/${mediaType}`);
  }

  downloadCertifMedia(mediaId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${mediaId}`, {
      responseType: 'blob'
    });
  }

  deleteCertifMedia(mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mediaId}`);
  }

  getMediaTypes(): Observable<MediaType[]> {
    return this.http.get<MediaType[]>(`${this.apiUrl}/media-types`);
  }

  getCertifMediaByCategory(username: string, category: string): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/${username}/category/${category}`);
  }

  getCertifMediaByTypeAndCategory(username: string, mediaType: MediaType, category: string): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/${username}/type/${mediaType}/category/${category}`);
  }

  searchCertifMedia(username: string, title: string): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/${username}/search`, { params: { title } });
  }

  getAllCertifMedia(): Observable<CertifMedia[]> {
    return this.http.get<CertifMedia[]>(`${this.apiUrl}/all`);
  }
} 