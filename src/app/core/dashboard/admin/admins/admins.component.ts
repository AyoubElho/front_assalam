// admins.component.ts
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateUserDialogComponent} from '../create-user-dialog.component';
import {AuthService} from '../../../services/service/AuthService';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {AvatarComponent} from "../../../layouts/avatar-component/avatar-component.component";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
    imports: [
        MatButton,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        TitleCasePipe,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatIconModule,
        MatRowDef,
        DatePipe,
        MatIconButton,
        MatTooltipModule,
        NgClass,
        FormsModule,
        DropdownModule,
        AvatarComponent
    ],
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {
  displayedColumns: string[] = ['picture', 'name', 'email', 'role', 'created_at', 'actions'];
  writersAndAdmins: any[] = [];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Refresh the list if a new user was created
      }
    });
  }

  loadUsers(): void {
    this.authService.getAll().then(resp => {
      this.writersAndAdmins = resp.data.users;
    }).catch(err => {
      console.error('Error loading users:', err);
    });
  }

  generateAndResetPassword(user: any): void {
    const password = this.generateSecurePassword();

    const confirmed = confirm(`Generate and reset password for ${user.name}?\n\nNew Password: ${password}`);
    if (!confirmed) return;

    this.authService.resetUserPassword(user.id, password, password).then(() => {
      alert(`Password reset successfully!\nNew password: ${password}`);
    }).catch(err => {
      console.error('Error resetting password:', err);
      alert('Failed to reset password.');
    });
  }


  generateSecurePassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const allChars = uppercase + lowercase + digits;

    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    const passwordArray = [
      getRandom(uppercase),
      getRandom(lowercase),
      getRandom(digits)
    ];

    while (passwordArray.length < 10) {
      passwordArray.push(getRandom(allChars));
    }

    // Shuffle the password
    return passwordArray.sort(() => Math.random() - 0.5).join('');
  }

  confirmDelete(user: any) {
    const confirmed = confirm(`Are you sure you want to delete ${user.name}?`);

    if (confirmed) {
      this.authService.deleteUser(user.id)
        .then(() => {
          alert('User deleted successfully');
          this.loadUsers(); // Refresh the list if a new user was created
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        });
    }
  }
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Writer', value: 'writer' }
  ];

  updateUserRole(user: any): void {
    this.authService.modifyUserRole(user.id, user.role)
      .then(() => {
        alert(`Role updated to ${user.role}`);
      })
      .catch(err => {
        console.error('Failed to update role:', err);
        alert('Failed to update user role.');
      });
  }

}
