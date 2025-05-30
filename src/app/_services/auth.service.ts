import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {JwtResponse, LoginRequest, RegisterRequest, DirecteurRequest, RecruteurRequest} from '../_models/auth';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const DIRECTEUR_API = 'http://localhost:8080/api/directeur/';

const RECRUTEUR_API = 'http://localhost:8080/api/recruteur/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + 'login', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  registerProfessional(user: RegisterRequest): Observable<any> {
    return this.http.post(AUTH_API + 'register-professional', {
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      sexe: user.sexe,
      centre: user.centre,
      address: user.address
    }, httpOptions);
  }

  registerUser(user: RegisterRequest): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,

      sexe: user.sexe,
      centre: user.centre,
      address: user.address

    }, httpOptions);
  }

  directeurRegister(user: DirecteurRequest): Observable<any> {
    return this.http.post(DIRECTEUR_API + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,

      sexe: user.sexe,
      centre: user.centre,
      address: user.address
    }, httpOptions);
  }

  recruteurRegister(user: RecruteurRequest): Observable<any> {
    return this.http.post(RECRUTEUR_API + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      company: user.company,

      sexe: user.sexe,
      centre: user.centre,
      address: user.address
    }, httpOptions);
  }
}
