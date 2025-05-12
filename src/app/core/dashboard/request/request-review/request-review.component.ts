import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RequestService} from '../../../services/service/RequestService';
import {Avatar} from 'primeng/avatar';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-request-review',
  styleUrls: ['./request-review.component.css'],
  templateUrl: './request-review.component.html',
  imports: [
    Avatar,
    NgForOf,
    Tag,
    NgClass,
    Button,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    NgIf,
    DatePipe,
  ]
})
export class RequestReviewComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  selectedStatus: string = '';
  statuses: string[] = [];

  // Map for counts
  statusCounts: { [key: string]: number } = {};

  constructor(private requestService: RequestService, private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      this.statuses = ['قيد_مراجعة_المسؤول', 'مقبول', 'مرفوض', 'قيد_الانتظار'];
      this.selectedStatus = 'قيد_مراجعة_المسؤول';
    } else {
      this.statuses = ['قيد_المراجعة', 'غير_مكتمل', 'تمت_إعادة_رفع_الملفات'];
      this.selectedStatus = 'قيد_المراجعة';
    }

    this.requestService.getAllRequests().then(resp => {
      this.requests = resp.data;
      this.calculateStatusCounts();
      this.filterRequests();
    }).finally(() => {
      this.spinner.hide();
    });
  }


  nameTransform(name: string): string {
    if (!name) return '--';
    const parts = name.toUpperCase().split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  }

  goToDetails(id: number): void {
    this.router.navigate(['/dashboard/request/detaill/', id]);
  }

  getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    if (status === 'قيد_مراجعة_المسؤول' || status === 'قيد_المراجعة') {
      return 'warn';
    } else if (status === 'مقبول') {
      return 'success';
    } else if (status === 'مرفوض' || status === 'غير_مكتمل') {
      return 'danger';
    } else {
      return 'info';
    }
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(
      (request) => request.status === this.selectedStatus
    );
  }

  onStatusChange(event: any): void {
    this.selectedStatus = event.value;
    this.filterRequests();
  }

  formatStatus(status: string): string {
    const map: Record<string, string> = {
      'قيد_الانتظار': 'قيد الانتظار',
      'تمت_إعادة_رفع_الملفات': 'تمت إعادة رفع الملفات',
      'قيد_مراجعة_المسؤول': 'قيد مراجعة المسؤول',
      'غير_مكتمل': 'غير مكتمل',
      'قيد_المراجعة': 'قيد المراجعة',
      'مقبول': 'مقبول',
      'مرفوض': 'مرفوض'
    };
    return map[status] || status;
  }

  // Count requests for each status
  calculateStatusCounts(): void {
    this.statusCounts = {};
    for (const status of this.statuses) {
      this.statusCounts[status] = this.requests.filter(r => r.status === status).length;
    }
  }
}
