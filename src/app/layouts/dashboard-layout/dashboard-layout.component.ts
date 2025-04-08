import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../service/AuthService';
import {OrphanService} from '../../service/OrphanService';
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
    Ripple
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit {
  showFiller = false;

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

  ngOnInit(): void {
    this.authService.user().then(response => {
      this.user = response.data;
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });

    this.orphanService.getAll().then(responce => {
      console.log(responce.data)
      this.list = responce.data
    })

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
            command: () => this.logout() // Call logout method

          }
        ]
      }
    ];


  }


  logout() {
    this.authService.logout()
  }

  @ViewChild('drawerRef') drawerRef!: Drawer;

}
