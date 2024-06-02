import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service'; // adjust the path based on your project structure
import { User } from '../../models/user'; // adjust the path based on your project structure
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {
  }

  onRegister() {
    this.registerService.register(this.user).pipe(
      tap(response => {
        if(response.message === 'Success'){
          this.router.navigate(['/login']);
        }
      })
    ).subscribe();
  }
}