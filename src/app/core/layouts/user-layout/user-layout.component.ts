import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

// Angular Material
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogRef} from '@angular/material/dialog';

// PrimeNG
import {AvatarModule} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {Chip} from 'primeng/chip';
import {Dialog, DialogModule} from 'primeng/dialog';
import {DynamicDialogModule, DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Menu} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

// Third-party libraries
import {NgxSpinnerComponent} from 'ngx-spinner';
import {CountUpModule} from 'ngx-countup';
import {loadStripe} from '@stripe/stripe-js';

// Services
import {AuthService} from '../../services/service/AuthService';
import {CategoryService} from '../../services/service/CategoryService';

// Components
import {AvatarComponent} from '../avatar-component/avatar-component.component';
import {DonationDialogComponent} from '../donation-dialog/donation-dialog.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, RouterOutlet,
    NgIf, NgClass,
    AvatarModule, Menu, DialogModule,
    DynamicDialogModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    CountUpModule,
    NgxSpinnerComponent,
    AvatarComponent,
    MatButtonModule, MatMenuModule, MatIconModule
  ],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
})
export class UserLayoutComponent implements OnInit {
  token = localStorage.getItem('jwt');
  role = localStorage.getItem('role');
  listCategory: any = [];
  dialog = inject(MatDialog);
  categoryService = new CategoryService();
  items: MenuItem[] = [];
  user: any;
  isMenuOpen = false;
  menuOpen: boolean = false;
  loading: unknown;


  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  isAdminOrWriterOrSuper(): boolean {
    return this.role === 'admin' || this.role === 'writer' || this.role === 'super_admin';
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    window.location.reload();
  }

  ngOnInit(): void {
    console.log('Role:', this.role);
    this.authService.user().then(response => {
      this.user = response.data;
      let roleDisplay = '';

      if (this.isAdminOrWriterOrSuper()) {
        if (this.role === 'super_admin') {
          roleDisplay = 'مدير عام';
        } else if (this.role === 'admin') {
          roleDisplay = 'مسؤول';
        } else {
          roleDisplay = 'كاتبة';
        }
      } else {
        roleDisplay = 'مستخدم';
      }

      const displayName = `${this.user.name || 'المستخدم'}<br><small class="text-gray-400">${roleDisplay}</small>`;

      this.items = [
        {
          label: displayName,
          escape: false,
          icon: 'pi pi-user',
          items: [
            { separator: true },
            {
              label: 'الملف الشخصي',
              icon: 'pi pi-id-card',
              command: () => this.router.navigate(['/profile']),
            },
            ...(this.role === 'admin' || this.role === 'writer' || this.role === 'super_admin' ? [{
              label: 'لوحة التحكم',
              icon: 'pi pi-cog',
              command: () => this.router.navigate(['/dashboard']),
            }] : []),
            {
              label: 'الطلبات الخاصة بي',
              icon: 'pi pi-file',
              command: () => this.router.navigate(['/my-requests']),
            },
            {
              label: 'تسجيل الخروج',
              icon: 'pi pi-sign-out',
              command: () => this.logout(),
            },
          ],
        },
      ];

    }).catch(error => {
      console.error('فشل في جلب بيانات المستخدم:', error);
    });

    this.categoryService.getAll().then(response => {
      this.listCategory = response.data;});
  }

  showDialog() {
    this.dialog.open(DonationDialogComponent, {});
  }

  scrollToSection(sectionId: string) {
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollTo(sectionId);
        }, 50);
      });
    } else {
      this.scrollTo(sectionId);
    }
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  onCategoryClick(name: string) {
    this.router.navigate(['/category', name]);
  }
}
