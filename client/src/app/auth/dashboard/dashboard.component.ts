import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Observable, of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { Dashboard } from 'src/app/models/dashboard';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData$: Observable<Dashboard>;

  constructor(private dashboardService: DashboardService, private router: Router) {
    this.dashboardData$ = EMPTY;
   }

   ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId === null) {
      this.router.navigate(['/login']);
    } else {
      this.dashboardData$ = this.dashboardService.getDashboardData().pipe(
        tap(data => console.log(data))
      );
    }
  }
}