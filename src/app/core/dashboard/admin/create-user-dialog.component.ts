// create-user-dialog.component.ts
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/service/AuthService';
import {JsonPipe, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],

  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    JsonPipe,
    MatIconButton,
    MatOption,
    MatSelectModule,
    MatButton
  ],
  template: `
    <div class="p-6 w-full max-w-[500px] bg-white rounded-xl font-['Inter'] shadow-lg">
      <h2 class="mb-6 text-2xl font-semibold text-gray-900">Create New User</h2>
      <form [formGroup]="userForm" class="grid gap-5">
        <!-- Name -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="userForm.get('name')?.hasError('required') && userForm.get('name')?.touched">
            Name is required
          </mat-error>
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="userForm.get('email')?.hasError('required') && userForm.get('email')?.touched">
            Email is required
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email') && userForm.get('email')?.touched">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <!-- Birth Date -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Birth Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birth_date" placeholder="Choose a date">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="userForm.get('birth_date')?.hasError('required') && userForm.get('birth_date')?.touched">
            Birth date is required
          </mat-error>
        </mat-form-field>

        <!-- Role -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="">-- Select Role --</mat-option>
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="writer">Writer</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required') && userForm.get('role')?.touched">
            Role is required
          </mat-error>
        </mat-form-field>

        <!-- Password -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>Password</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <button mat-icon-button matSuffix type="button" (click)="generatePassword()">
            <mat-icon>autorenew</mat-icon>
          </button>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="userForm.get('password')?.hasError('required') && userForm.get('password')?.touched">
            Password is required
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength') && userForm.get('password')?.touched">
            Password must be at least 8 characters long
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('pattern') && userForm.get('password')?.touched">
            Password must include uppercase, lowercase, and a number
          </mat-error>
        </mat-form-field>

      </form>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="createUser()">
          Create User
        </button>
      </div>
    </div>

  `,
  styles: [] // Empty styles array since we're using Tailwind
})
export class CreateUserDialogComponent {
  userForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
      ]]
    });
  }

  generatePassword(): void {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const allChars = uppercase + lowercase + digits;

    // Ensure at least one of each required character
    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
    const requiredChars = [
      getRandom(uppercase),
      getRandom(lowercase),
      getRandom(digits)
    ];

    // Generate remaining characters randomly
    const remainingLength = 8; // total desired length
    for (let i = requiredChars.length; i < remainingLength; i++) {
      requiredChars.push(getRandom(allChars));
    }

    // Shuffle the characters to make the password unpredictable
    const shuffled = requiredChars.sort(() => 0.5 - Math.random()).join('');

    this.userForm.patchValue({password: shuffled});
    this.userForm.get('password')?.markAsTouched();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  createUser(): void {


    if (this.userForm.invalid) return;

    const newUser = this.userForm.value;
    const rawDate: Date = this.userForm.get('birth_date')?.value;
    const formattedDate = rawDate.toISOString().split('T')[0]; // "2022-05-08"
    const payload = {
      ...newUser,
      birth_date: formattedDate, // 👈 inject formatted date here
      password_confirmation: newUser.password
    }
    console.log(payload)
    this.authService.register(payload).then(() => {
      this.dialogRef.close(true);
    }).catch(err => {
      console.error('Error creating user:', err);
    });
  }

}
