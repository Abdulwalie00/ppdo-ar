import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-edit-user',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent {
  userId: number = -1;
  user: User = {
    id: -1,
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    username: '',
    passwordHash: '',
    role: 'Viewer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  showDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.userId = +this.route.snapshot.params['id'];
    const existingUser = this.authService.usersList.find(u => u.id === this.userId);
    if (existingUser) {
      this.user = { ...existingUser };
    } else {
      this.router.navigate(['/accounts']); // Redirect if user not found
    }
  }

  submit(): void {
    this.showDialog = true;
  }

  onConfirm(result: boolean): void {
    if (result && this.user) {
      this.authService.updateUser(this.userId, {
        firstName: this.user.firstName,
        middleName: this.user.middleName,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
        passwordHash: this.user.passwordHash,
        role: this.user.role,
      });
      this.router.navigate(['/accounts']);
    } else {
      this.showDialog = false;
    }
  }
}
