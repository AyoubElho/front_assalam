import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/service/AuthService';
import {Toast} from 'primeng/toast';
import {NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {Router, RouterLink} from '@angular/router';
import {Calendar} from 'primeng/calendar';

@Component({
  selector: 'app-register',
  imports: [
    Toast,
    ReactiveFormsModule,
    NgIf,
    Button,
    RouterLink,
    Calendar
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  loading = false;
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('password_confirmation')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formData = {
      ...this.registerForm.value,
      birth_date: this.formatDate(this.registerForm.value.birth_date)
    };

    this.authService.register(formData)
      .then(response => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: 'تم إنشاء الحساب بنجاح'
        });
        this.router.navigate(['/login']);
      })
      .catch(error => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: error?.response?.data?.message || 'حدث خطأ أثناء التسجيل'
        });
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
