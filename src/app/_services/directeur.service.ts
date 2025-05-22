import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsable, ResponsableRequest } from '../_models/responsable';

const API_URL = 'http://localhost:8080/api/directeur/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DirecteurService {
  constructor(private http: HttpClient) { }

  createResponsable(request: ResponsableRequest): Observable<any> {
    return this.http.post(API_URL + 'responsables', request, httpOptions);
  }

  getAllResponsables(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(API_URL + 'responsables', httpOptions);
  }

  getResponsableById(id: number): Observable<Responsable> {
    return this.http.get<Responsable>(`${API_URL}responsables/${id}`, httpOptions);
  }

  updateResponsable(id: number, request: ResponsableRequest): Observable<any> {
    return this.http.put(`${API_URL}responsables/${id}`, request, httpOptions);
  }

  deleteResponsable(id: number): Observable<any> {
    return this.http.delete(`${API_URL}responsables/${id}`, httpOptions);
  }
} 