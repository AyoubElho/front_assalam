import {Component, inject, OnInit, AfterViewInit} from '@angular/core';
import {AuthService} from '../../services/service/AuthService';
import {MatIconModule} from '@angular/material/icon';
import {DonationService} from '../../services/service/DonationService';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {InfiniteScrollDirective} from 'ngx-infinite-scroll';
import {BarChartModule} from "@swimlane/ngx-charts";
import {NgxFastMarqueeModule} from "ngx-fast-marquee";
import {CountUpModule} from 'ngx-countup';
import {NgxSpinnerService} from 'ngx-spinner';
import {DonationDialogComponent} from '../../layouts/donation-dialog/donation-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    NgForOf,
    DatePipe,
    BarChartModule,
    MatDialogModule,
    NgxFastMarqueeModule,
    CountUpModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  donationService = inject(DonationService);
  private spinner = inject(NgxSpinnerService);

  donations: any = [];
  today: Date = new Date();
  dialog = inject(MatDialog);

  showDialog() {
    this.dialog.open(DonationDialogComponent, {});
  }
  ngOnInit(): void {
    this.spinner.show();
    this.donationService.getAll().then(res => {
      this.donations = res.data;
    }).finally(() => {
      this.spinner.hide(); // Ensure hide is always called
    });
  }

}
