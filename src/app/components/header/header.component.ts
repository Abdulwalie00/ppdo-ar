import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUserCircle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service'; // <-- Import UserService
import { User } from '../../models/user.model'; // <-- Import User model

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  faBell = faBell;
  faUserCircle = faUserCircle;
  faSun = faSun;
  faMoon = faMoon;
  isDarkMode = false;

  currentTime: string = '';
  menuOpen = false;
  currentUser: User | null = null;

  private intervalId: any;
  private authSubscription!: Subscription; // To manage the subscription

  // Inject both AuthService and UserService
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTheme();
    this.startTimeUpdater();

    // Subscribe to the authentication state
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.fetchCurrentUserProfile();
      } else {
        this.currentUser = null;
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    clearInterval(this.intervalId);
  }

  /**
   * Fetches the current user's profile from the backend using the JWT.
   */
  fetchCurrentUserProfile(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        // Ensure this matches your actual JWT token structure
        const decodedToken: any = jwtDecode(token);
        const username = decodedToken.sub || decodedToken.username;

        if (!username) {
          throw new Error('Username not found in token');
        }

        this.userService.getUserByUsername(username).subscribe({
          next: (user) => {
            this.currentUser = user;
          },
          error: (err) => {
            console.error('Failed to fetch user:', err);
            this.logout();
          }
        });
      } catch (error) {
        console.error('Invalid token:', error);
        this.logout();
      }
    }
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  startTimeUpdater(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }



  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenu();
  }
}
