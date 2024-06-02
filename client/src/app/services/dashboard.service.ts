import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../models/dashboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<Dashboard> {
    const userId = localStorage.getItem('user_id');
    return this.http.get<Dashboard>(`/api/dashboard/${userId}`, { withCredentials: true});
  }
}