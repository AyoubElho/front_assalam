import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Event as RouterEvent} from '@angular/router';
import {AuthService} from '../../services/service/AuthService';
import {AvatarComponent} from '../../layouts/avatar-component/avatar-component.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],


  imports: [
    MatButton,
    MatProgressSpinnerModule,
    MatInput,
    MatFormField,
    MatIconButton,
    MatLabel, MatSuffix,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatError,
    NgIf,
    ReactiveFormsModule,
    MatIconModule, AvatarComponent
  ]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  previewUrl: string | null = null;
  currentUser = {pic: null};
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  user: any

  authService = inject(AuthService)

  // Editable flags
  isNameEditable = false;
  isEmailEditable = false;
  isBirthDateEditable = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      birth_date: [{value: '', disabled: true}],
      current_password: [''],
      new_password: [''],
      password_confirmation: ['']
    });

  }

  ngOnInit(): void {
    this.authService.user().then(resp => {
      this.user = resp.data
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        birth_date: this.user.birth_date
      });
    })
  }

  toggleNameEditable() {
    const control = this.profileForm.get('name');
    if (control?.disabled) {
      control.enable();
      this.isNameEditable = true;
    } else {



      control?.disable();
      this.profileForm.patchValue({
        name: this.user.name,
      });
      this.isNameEditable = false
    }
  }

  toggleEmailEditable() {
    const control = this.profileForm.get('email');
    if (control?.disabled) {
      control.enable();
      this.isEmailEditable = true;
    } else {
      control?.disable();
      this.profileForm.patchValue({
        email: this.user.email,
      });
      this.isEmailEditable = false;

    }
  }

  toggleBirthDateEditable() {
    const control = this.profileForm.get('birth_date');
    if (control?.disabled) {
      control.enable();
      this.isBirthDateEditable = true;
    } else {
      control?.disable();
      this.profileForm.patchValue({
        birth_date: this.user.birth_date,
      });
      this.isBirthDateEditable = false;
    }
  }


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        // You can also send the file to the server here if needed
      };
      reader.readAsDataURL(file);
    }
  }


  removeProfilePicture() {
    this.previewUrl = null;
    this.currentUser.pic = null;
    this.user.pic = null; // if you want to remove the backend image too
  }


  onSubmit() {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    // Handle form submission here
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'تم حفظ التغييرات بنجاح';
    }, 2000);
  }

  onCancel() {
    // Reset form or navigate away
  }

  openDeleteAccountDialog() {
    // Handle account deletion confirmation
  }


}
