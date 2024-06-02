import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  userId: string;

  constructor(private authService: AuthService, private router: Router) {
    this.userId = this.authService.getCurrentUserId();
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      // navigate to the login page
      this.router.navigate(['/login']);
    });
  }
}