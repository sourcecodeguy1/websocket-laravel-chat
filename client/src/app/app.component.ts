import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.initializeApp().subscribe(() => {
      console.log('CSRF cookie has been set');
    });
  }
}