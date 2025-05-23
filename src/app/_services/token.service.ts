import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';

  private userSubject: BehaviorSubject<any | null>;
  public user$: Observable<any | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    let initialUser = null;
    if (isPlatformBrowser(this.platformId)) {
      const userStr = window.sessionStorage.getItem(this.USER_KEY);
      if (userStr) {
        try {
          initialUser = JSON.parse(userStr);
        } catch (e) {
          console.error('Error parsing user from session storage', e);
          window.sessionStorage.removeItem(this.USER_KEY);
        }
      }
    }
    this.userSubject = new BehaviorSubject<any | null>(initialUser);
    this.user$ = this.userSubject.asObservable();
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem(this.TOKEN_KEY);
      window.sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.clear();
      this.userSubject.next(null);
    }
  }

  saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem(this.USER_KEY);
      window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.userSubject.next(user);
    }
  }

  getUser(): any {
    return this.userSubject.getValue();
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
