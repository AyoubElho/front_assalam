import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

// Services
import { OrphanService } from '../../services/service/OrphanService';
import { DonationService } from '../../services/service/DonationService';
import { RequestService } from '../../services/service/RequestService';
import { WidowService } from '../../services/service/WidowService';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [NgOptimizedImage, NgxChartsModule, MatIconModule, RouterLink]
})
export class HomeComponent implements OnInit {

  // Dashboard Stats
  countOrphan: number = 0;
  countWidow: number = 0;
  totalAmount: number = 0;

  // Chart Data
  donationsPerMonth: any[] = [];
  requestsByStatus: any[] = [];

  // Services
  private orphanService = new OrphanService();
  private donationService = new DonationService();
  private requestService = new RequestService();
  private widowService = new WidowService();

  // Lifecycle
  ngOnInit() {
    this.loadOrphanCount();
    this.loadWidowCount();
    this.loadDonationsData();
    this.loadTotalAmount();
    this.loadRequestData();
  }

  // ===== Data Loaders =====
  private loadOrphanCount() {
    this.orphanService.count().then(response => {
      this.countOrphan = response.data;
    });
  }

  private loadWidowCount() {
    this.widowService.count().then(response => {
      this.countWidow = response.data.total;
    });
  }

  private loadDonationsData() {
    this.donationService.getAll().then(response => {
      const donations = response.data;
      this.donationsPerMonth = this.aggregateDonationsByMonth(donations);
    });
  }

  private loadTotalAmount() {
    this.donationService.getTotalAmount().then(response => {
      this.totalAmount = response.data.total_amount;
    }).catch(error => {
      console.error('Error fetching total amount:', error);
    });
  }

  private loadRequestData() {
    this.requestService.getAllRequests().then(response => {
      const requests = response.data;
      this.requestsByStatus = this.aggregateRequestsByStatus(requests);
    });
  }

  // ===== Helpers =====
  private aggregateRequestsByStatus(requests: any[]): any[] {
    const statusMap: { [key: string]: number } = {};

    for (const request of requests) {
      const status = request.status;
      statusMap[status] = (statusMap[status] || 0) + 1;
    }

    return Object.entries(statusMap).map(([status, count]) => ({
      name: status.replace('_', ' '),
      value: count
    }));
  }

  private aggregateDonationsByMonth(donations: any[]): any[] {
    const monthlyTotals: { [month: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const donation of donations) {
      if (!donation.created_at) continue;
      const date = new Date(donation.created_at);
      const monthName = months[date.getMonth()];
      monthlyTotals[monthName] = (monthlyTotals[monthName] || 0) + donation.amount;
    }

    return months.map(month => ({
      name: month,
      value: monthlyTotals[month] || 0
    }));
  }

}
