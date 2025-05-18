import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AvatarModule} from 'primeng/avatar';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../services/service/AuthService';
import {NgIf} from "@angular/common";
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {CategoryService} from '../../services/service/CategoryService';
import {NgxSpinnerComponent} from 'ngx-spinner';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {loadStripe} from '@stripe/stripe-js';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Chip} from "primeng/chip";
import {CountUpModule} from 'ngx-countup';
import {AvatarComponent} from '../../avatar-component/avatar-component.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterLink, AvatarModule, Menu, NgIf, RouterOutlet, MatButtonModule, MatMenuModule, MatIconModule,
    RouterLinkActive, NgxSpinnerComponent, Button, Dialog, FormsModule, ReactiveFormsModule,
    HttpClientModule, Chip, CountUpModule, AvatarComponent],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  token = localStorage.getItem('jwt');
  role = localStorage.getItem('role');
  listCategory: any = []
  categoryService = new CategoryService();
  items: MenuItem[] = [];
  user = {
    name: '',
    email: '',
    pic: '',
  };

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
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
    console.log('Role:', this.role);  // Check role value
    this.authService.user().then(response => {
      this.user = response.data;

      let roleDisplay = '';

      if (this.isAdminOrWriterOrSuper()) {
        if (this.role === 'super_admin') {
          roleDisplay = 'مدير عام';
        } else if (this.role === 'admin') {
          roleDisplay = 'مسؤول';
        } else if (this.role === 'writer') {
          roleDisplay = 'كاتبة';
        } else {
          roleDisplay = 'كاتبة'; // fallback
        }
      } else {
        roleDisplay = 'مستخدم';
      }

      const displayName = `${this.user.name || 'المستخدم'}<br><small class="text-gray-400">${roleDisplay}</small>`;


      this.items = [
        {
          label: displayName,
          escape: false, // allow HTML in label
          icon: 'pi pi-user',
          items: [
            {separator: true},
            {
              label: 'الملف الشخصي',
              icon: 'pi pi-id-card',
              command: () => this.router.navigate(['/profile'])
            },
            {
              label: 'الطلبات الخاصة بي',
              icon: 'pi pi-file',
              command: () => this.router.navigate(['/my-requests']) // 👈 adjust route if needed
            },
            {
              label: 'تسجيل الخروج',
              icon: 'pi pi-sign-out',
              command: () => this.logout()
            }
          ]
        }
      ];

    }).catch(error => {
      console.error('فشل في جلب بيانات المستخدم:', error);
    });

    this.categoryService.getAll().then(reseponce => {
      this.listCategory = reseponce.data
      console.log(reseponce.data)
    })

  }

  dropdownOpen = false;
  menuOpen: boolean = false;
  donation: number = 0
  visible: boolean = false;
  loading: unknown;

  showDialog() {
    this.visible = true;
  }

  stripePromise = loadStripe('pk_test_51R7ib8RofECHEHo8BD6GLKXS2YpjYcKm4IeEFY48gOLMmHMTx5zPZAjB3wKSp4kpbnadjSRc8FlxVAkk9QQ4P8qy00WuWH044c');


  async submitDonation() {
    this.loading = true; // <-- Start loading

    const stripe = await this.stripePromise;

    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found. Please log in.');
      this.loading = false; // <-- Stop loading if error
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.http.post<any>('http://127.0.0.1:8000/api/create-checkout-session', {amount: this.donation}, {headers})
      .subscribe(async (res) => {
        const result = await stripe?.redirectToCheckout({
          sessionId: res.id,
        });
        this.loading = false; // <-- Stop loading after success
        if (result?.error) {
          console.error(result.error.message);
        }
      }, error => {
        console.error('Payment failed:', error);
        this.loading = false; // <-- Stop loading after error
      });
  }


  onCategoryClick(name: string) {
    this.router.navigate(['/category', name]);
  }


}
