// app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../components/warning-dialog/warning-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog // Inject MatDialog
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the user is an admin
    if (this.authService.isAdmin()) {
      return true; // Yes, allow access
    }

    // No, open a warning dialog
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '350px',
      data: {
        title: '⛔ Access Denied',
        message: 'You must be an administrator to access this page.'
      }
    });

    // After the dialog is closed, redirect the user to the main dashboard
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/project-dashboard']);
    });

    // Block the navigation attempt
    return false;
  }
}
