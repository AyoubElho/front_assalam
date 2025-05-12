import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  imports: [
    NgIf,
    RouterLink
  ]
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
  }

}
