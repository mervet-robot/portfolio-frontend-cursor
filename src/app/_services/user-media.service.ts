import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MediaType, UserMedia} from '../_models/user-media';


@Injectable({
  providedIn: 'root'
})
export class UserMediaService {
  private apiUrl  = 'http://localhost:8080/api/user-media'; // adapte si besoin

  constructor(private http: HttpClient) { }

  uploadMediaP(profileId: number, file: File, mediaType: MediaType, titre: string, description: string, category: string, verified: boolean): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType.toString());
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('verified', verified.toString()); // must be string for FormData

    const req = new HttpRequest('POST', `${this.apiUrl}/${profileId}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }


  getProjectMediaP(profileId: number): Observable<UserMedia[]> {
    return this.http.get<UserMedia[]>(`${this.apiUrl}/${profileId}`);
  }

  getProjectMediaByType(profileId: number, mediaType: MediaType): Observable<UserMedia[]> {
    return this.http.get<UserMedia[]>(`${this.apiUrl}/${profileId}/type/${mediaType}`);
  }

  downloadMediaP(mediaId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${mediaId}`, {
      responseType: 'blob'
    });
  }

  deleteMediaP(mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mediaId}`);
  }

  getMediaTypes(): Observable<MediaType[]> {
    return this.http.get<MediaType[]>(`${this.apiUrl}/media-types`);
  }

//-------------------ADD FILTER AND RESEARCH

  getProjectMediaByCategory(profileId: number, category: string): Observable<UserMedia[]> {
    return this.http.get<UserMedia[]>(`${this.apiUrl}/${profileId}/category/${category}`);
  }

  getProjectMediaByTypeAndCategory(profileId: number, mediaType: MediaType, category: string): Observable<UserMedia[]> {
    return this.http.get<UserMedia[]>(`${this.apiUrl}/${profileId}/type/${mediaType}/category/${category}`);
  }

  searchProjectMedia(profileId: number, title: string): Observable<UserMedia[]> {
    return this.http.get<UserMedia[]>(`${this.apiUrl}/${profileId}/search`, { params: { title } });
  }


}
