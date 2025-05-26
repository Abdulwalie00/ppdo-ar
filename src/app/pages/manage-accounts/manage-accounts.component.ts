import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService, User} from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-manage-accounts',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-accounts.component.html',
})
export class ManageAccountsComponent {
  users: User[] = [];
  editedUserIndex: number | null = null;
  newUser: User = this.resetUser();

  constructor(private authService: AuthService) {
    // For demo, access the internal user list (you might want to change this in a real app)
    this.users = [...(this.authService as any).users]; // Caution: accessing private field
  }

  resetUser(): User {
    return {
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'Viewer',
    };
  }

  addUser() {
    this.users.push({ ...this.newUser });
    this.newUser = this.resetUser();
  }

  editUser(index: number) {
    this.editedUserIndex = index;
    this.newUser = { ...this.users[index] };
  }

  updateUser() {
    if (this.editedUserIndex !== null) {
      this.users[this.editedUserIndex] = { ...this.newUser };
      this.editedUserIndex = null;
      this.newUser = this.resetUser();
    }
  }

  deleteUser(index: number) {
    this.users.splice(index, 1);
  }

  cancelEdit() {
    this.editedUserIndex = null;
    this.newUser = this.resetUser();
  }
}
