import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}

  email = '';
  password = '';

  login() {
    this.router.navigate(['/dashboard']); // redirect after login
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
