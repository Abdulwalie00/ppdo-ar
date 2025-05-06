import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUserCircle, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import {AuthService, User} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';

    // Apply or remove dark class on HTML root
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Start time updater
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);

    // Subscribe to user info from auth service
    this.authService.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
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
