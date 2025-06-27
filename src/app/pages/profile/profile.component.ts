import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { jwtDecode } from 'jwt-decode'; // <-- Import jwt-decode

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // <-- Add CommonModule for ngIf
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  users: User[] = [];
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token);
        const username = decodedToken.sub; // 'sub' is the standard claim for subject (username)

        this.userService.getUserByUsername(username).subscribe({
          next: (userData) => {
            this.user = userData;
          },
          error: (err) => {
            console.error('Failed to fetch user profile', err);
            // Optionally handle error, e.g., log out the user
            this.authService.logout();
          }
        });



          this.userService.getUsers().subscribe({
            next: (data) => {
              this.users = data;
            },
            error: (err) => {
              console.error('Failed to load users', err);
              if (err.status === 403) {
                alert('You need ADMIN privileges to access this page');
              }
            }
          });


      } catch (error) {
        console.error('Invalid token:', error);
        this.authService.logout();
      }
    }
  }
}
