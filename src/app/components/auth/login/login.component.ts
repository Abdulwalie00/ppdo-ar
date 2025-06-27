import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { AuthService } from '../../../services/auth.service'; // Correctly imported

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;
  success = false;

  // We inject the AuthService and Router.
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * This method is called when the user submits the login form.
   * It uses the AuthService to send the credentials to the backend.
   */
  login(): void {
    this.error = '';
    this.loading = true;

    const credentials = {
      username: this.username.trim(),
      password: this.password
    };

    // We call the service's login method and "subscribe" to the response.
    this.authService.login(credentials).subscribe({
      // --- Success Case ---
      // The 'next' block runs if the backend returns a 200 OK response.
      next: () => {
        this.loading = false;
        this.success = true;
        // Navigate to the dashboard after a brief delay.
        setTimeout(() => {
          this.router.navigate(['/project-dashboard']);
        }, 1000);
      },
      // --- Error Case ---
      // The 'error' block runs if the backend returns an error (e.g., 401, 403).
      error: (err) => {
        this.loading = false;
        // Display a user-friendly error message.
        this.error = 'Invalid username or password. Please try again.';
        console.error('Login failed', err); // Log the technical error for debugging.
      }
    });
  }
}
