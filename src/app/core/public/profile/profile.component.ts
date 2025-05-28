
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {JsonPipe, NgIf} from '@angular/common';
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
    MatIconModule, AvatarComponent, JsonPipe
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

  selectedFile: File | null = null; // Add this to your component

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}, [Validators.email]],
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
  hasChanges(): boolean {
    return (
      this.isNameEditable ||
      this.isEmailEditable ||
      this.isBirthDateEditable ||
      this.selectedFile !== null ||
      (this.profileForm.value.current_password &&
        this.profileForm.value.new_password &&
        this.profileForm.value.password_confirmation)
    );
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file; // ✅ Store the file
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }



  removeProfilePicture() {
    this.previewUrl = null;
  }


  onSubmit() {
    if (this.profileForm.invalid || !this.hasChanges()) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();

    if (this.isNameEditable) {
      console.log(this.profileForm.get('name')?.value)
      formData.append('name', this.profileForm.get('name')?.value);
    }

    if (this.isEmailEditable) {
      formData.append('email', this.profileForm.get('email')?.value);
    }

    if (this.isBirthDateEditable) {
      formData.append('birth_date', this.profileForm.get('birth_date')?.value);
    }

    if (this.selectedFile) {
      formData.append('pic', this.selectedFile);
    }

    const currentPassword = this.profileForm.get('current_password')?.value;
    const newPassword = this.profileForm.get('new_password')?.value;
    const passwordConfirmation = this.profileForm.get('password_confirmation')?.value;

    if (currentPassword && newPassword && passwordConfirmation) {
      formData.append('current_password', currentPassword);
      formData.append('new_password', newPassword);
      formData.append('new_password_confirmation', passwordConfirmation);
    }

    this.authService.updateProfile(formData).then(res => {
      this.successMessage = 'تم حفظ التغييرات بنجاح';
      this.errorMessage = '';
      this.isLoading = false;
      this.isNameEditable = false;
      this.isEmailEditable = false;
      this.isBirthDateEditable = false;
      this.selectedFile = null;
      this.previewUrl = null;

      // Update the local user object
      this.user = res.data.user;
      this.profileForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        birth_date: this.user.birth_date
      });

      // Disable fields again
      this.profileForm.get('name')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('birth_date')?.disable();
    }).catch(err => {
      this.isLoading = false;
      this.successMessage = '';
      this.errorMessage = err?.error?.message || 'حدث خطأ أثناء تحديث البيانات';
    });
  }


  onCancel() {
    // Reset form or navigate away
  }

  openDeleteAccountDialog() {
    // Handle account deletion confirmation
  }


}
