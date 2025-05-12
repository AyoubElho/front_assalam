import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/service/AuthService';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Toast} from 'primeng/toast';
import {Ripple} from 'primeng/ripple';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {NgIf} from '@angular/common';
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    Button,
    Ripple,
    Toast,
    NgIf,
    PrimeTemplate,
    Avatar
  ],
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
      });
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).then(
      (response) => {
        this.loading = false;

        const token = response.data.message; // The token
        const userRole: string = response.data.role; // User role

        if (token && userRole) {
          localStorage.setItem('jwt', token);
          localStorage.setItem('role', userRole);

          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: `تم تسجيل الدخول ك${userRole === 'services' ? 'مسؤول' : 'مستخدم'}`
          });
          this.router.navigate(['/'])
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'معلومات الحساب غير صحيحة'
          });
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تسجيل الدخول، يرجى التحقق من بياناتك'
        });
      }
    );
  }
}
