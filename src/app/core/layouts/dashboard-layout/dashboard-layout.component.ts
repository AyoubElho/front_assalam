import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../services/service/AuthService';
import {OrphanService} from '../../services/service/OrphanService';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Drawer} from 'primeng/drawer';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Avatar} from 'primeng/avatar';
import {SplitButton} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {RequestService} from '../../services/service/RequestService';
import {NgIf} from '@angular/common';
import {NgxSpinnerComponent} from "ngx-spinner";
import {Chip} from 'primeng/chip';
import {AvatarComponent} from '../avatar-component/avatar-component.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    MatSidenavModule,
    MatDrawerContainer,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    Avatar,
    RouterLinkActive,
    Menu,
    NgIf,
    NgxSpinnerComponent,
    Chip,
    AvatarComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit {
  requestServ = new RequestService();
  counts: { [key: string]: number } = {};
  role = localStorage.getItem('role'); // Assuming role is stored as 'role'

  // Define user object with properties
  user = {
    name: '',
    email: '',
    pic: '',
  };
  items: MenuItem[] | undefined;


  list = []

  constructor(private authService: AuthService, private orphanService: OrphanService, private router: Router) {
  }

  shouldShowDot(): boolean {
    if (this.role === 'writer') {
      return (this.counts['قيد_المراجعة'] > 0 || this.counts['تمت_إعادة_رفع_الملفات'] > 0);
    } else if (this.role === 'admin') {
      return (this.counts['قيد_مراجعة_المسؤول'] > 0);
    }
    return false;
  }

  ngOnInit(): void {
    if (this.role === 'writer') {
      const statuses = ['قيد_المراجعة', 'تمت_إعادة_رفع_الملفات'];
      statuses.forEach(status => {
        this.requestServ.countByStatus(status).then(resp => {
          this.counts[status] = resp.data;
        });
      });
    } else if (this.role === 'admin') {
      const status = 'قيد_مراجعة_المسؤول';
      this.requestServ.countByStatus(status).then(resp => {
        this.counts[status] = resp.data;
      });
    }

    this.authService.user().then(response => {
      this.user = response.data;
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });

    this.items = [
      {
        items: [
          {
            label: 'الملف الشخصي',
            icon: 'pi pi-user'
          },
          {
            label: 'تسجيل الخروج',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ];
  }

  isSuperAdmin(): boolean {
    // Implement your logic to check if current user is super admin
    return this.role === 'super_admin'; // Example
  }
  logout() {
    this.authService.logout()
  }

  @ViewChild('drawerRef') drawerRef!: Drawer;

}
