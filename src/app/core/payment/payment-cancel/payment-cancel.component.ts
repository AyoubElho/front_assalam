import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-payment-cancel',
  imports: [
    RouterLink
  ],
  templateUrl: './payment-cancel.component.html',
  styleUrl: './payment-cancel.component.css'
})
export class PaymentCancelComponent {
  constructor(private route:Router) {
  }
  back() {

  }
}
