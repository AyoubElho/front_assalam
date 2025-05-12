import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {AuthService} from '../../services/service/AuthService';
import {FormsModule} from '@angular/forms';
import {NgxFastMarqueeModule} from 'ngx-fast-marquee';

@Component({
  selector: 'app-profile',
  imports: [NgxFastMarqueeModule , FormsModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    this.loading = true;
    this.authService.user()
      .then(response => {
        this.loading = false;
        this.user = response.data;
      })
      .catch(error => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحميل معلومات المستخدم'
        });
      });
  }

  onUpdateProfile() {

  }

  onImageSelected($event: Event) {

  }
}
