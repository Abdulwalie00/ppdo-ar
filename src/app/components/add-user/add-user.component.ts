import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-add-user',
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    username: '',
    passwordHash: '',
    role: 'Viewer',
  };

  showDialog = false;

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    this.showDialog = true;
  }

  onConfirm(result: boolean): void {
    if (result) {
      const newUser: User = {
        ...this.user,
        id: this.authService.generateNextId(), // assuming this method exists
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.authService.addUser(newUser);
      this.router.navigate(['/accounts']);
    } else {
      this.showDialog = false;
    }
  }
}
