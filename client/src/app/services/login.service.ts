import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user'; // adjust the path based on your project structure
import { LoginResponse } from '../models/login.response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post<LoginResponse>('/api/login', user, { withCredentials: true });
  }
}