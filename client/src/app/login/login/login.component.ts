import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    email: '',
    password: ''
  };

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.loginService.login(this.user).subscribe(response => {
      if (response.user && response.user.id) {
        localStorage.setItem('user_id', response.user.id);
      } else {
        // handle the case where response.user.id is undefined
      }
    });
  }

  onLogin() {
    this.loginService.login(this.user).pipe(
      tap(response => {
        console.log(response);
        if (response.message === 'Success') {
          localStorage.setItem('user_id', response.id);
          this.router.navigate(['/dashboard/' + response.id]);
        }
      }),
      catchError(error => {
        console.log(error);
        if (error.status === 401) {
          // Show an error message
        }
        return of(error);
      })
    ).subscribe();
  }
}