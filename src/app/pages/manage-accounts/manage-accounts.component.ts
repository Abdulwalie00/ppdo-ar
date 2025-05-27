import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AuthService, User } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-manage-accounts',
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './manage-accounts.component.html',
})
export class ManageAccountsComponent {
  users: User[] = [];
  showDialog = false;
  dialogMessage = '';
  confirmAction: (() => void) | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.authService.usersList;
  }

  navigateToAdd(): void {
    this.router.navigate(['/accounts/add']);
  }

  navigateToEdit(userId: number): void {
    this.router.navigate(['/accounts/edit', userId]);
  }

  confirmDelete(userId: number): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ');
    this.dialogMessage = `Are you sure you want to delete "${fullName}"?`;

    this.confirmAction = () => {
      this.authService.deleteUser(userId);
      this.loadUsers(); // Refresh user list after deletion
    };

    this.showDialog = true;
  }

  onConfirm(result: boolean): void {
    if (result && this.confirmAction) {
      this.confirmAction();
    }
    this.showDialog = false;
  }
}
