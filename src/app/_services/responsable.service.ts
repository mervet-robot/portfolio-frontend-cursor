import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponsableRequest} from '../_models/responsable';

const API_URL = 'http://localhost:8080/api/recruteur/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ResponsableService {

  constructor(private http: HttpClient) {
  }

  register(request: ResponsableRequest): Observable<any> {
    return this.http.post(API_URL + 'register', request, httpOptions);
  }
}
