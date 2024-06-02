import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  initializeApp(): Observable<any> {
    return this.http.get('/sanctum/csrf-cookie');
  }

  logout() {
    return this.http.post('/api/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('user_id');
      })
    );
  }

  isAuthenticated(): boolean {
    // Replace this with your actual authentication logic
    return !!localStorage.getItem('user_id');
  }

  getCurrentUserId(): string {
    return localStorage.getItem('user_id') ?? '';
  }
}