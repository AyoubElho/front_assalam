import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/service/AuthService';
import { MatIconModule } from '@angular/material/icon';
import { DonationService } from '../../services/service/DonationService';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {BarChartModule} from "@swimlane/ngx-charts";
import {NgxFastMarqueeModule} from "ngx-fast-marquee";
import {CountUpModule} from 'ngx-countup';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    NgForOf,
    InfiniteScrollDirective,
    DatePipe,
    BarChartModule,
    NgxFastMarqueeModule,
    DecimalPipe,
    NgIf,
    CountUpModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  donationService = inject(DonationService);
  donations: any = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.donationService.getAll().then(res => {
      this.donations = res.data;
      console.log(res.data);
    });
  }

}
