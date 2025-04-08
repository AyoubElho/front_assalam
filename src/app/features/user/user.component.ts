import { Component } from '@angular/core';
import {AuthService} from '../../service/AuthService';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-user',
  imports: [
    MatToolbar,
    MatIconButton,
    MatIconModule
  ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css'
})
export class UserComponent {

  constructor(private authService: AuthService) {
  }




  logout() {
    this.authService.logout()
  }
}
