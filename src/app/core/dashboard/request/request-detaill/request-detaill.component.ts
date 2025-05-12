import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {DatePipe, JsonPipe} from '@angular/common';

import {Card} from 'primeng/card';
import {Panel} from 'primeng/panel';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';

import {MatCheckbox} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

import {NgxSpinnerService} from 'ngx-spinner';

import {RequestService} from '../../../services/service/RequestService';
import {RequestFileService} from '../../../services/service/RequestFileService';
import {WidowService} from '../../../services/service/WidowService';
import {DistituteService} from '../../../services/service/DistituteService';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-request-detaill',
  standalone: true,
  imports: [
    Card,
    NgIf,
    NgForOf,
    Avatar,
    ReactiveFormsModule,
    FormsModule,
    NgStyle,
    NgClass,
    MatIconModule,
  ],
  templateUrl: './request-detaill.component.html',
  styleUrl: './request-detaill.component.css',
})
export class RequestDetaillComponent implements OnInit {
  @Input() request: any = {};

  req_id!: number;
  role = localStorage.getItem('role');
  isLoading: boolean = true;

  statuses = [
    {value: 'pending', label: 'قيد المراجعة'},
    {value: 'accepted', label: 'مقبول'},
    {value: 'rejected', label: 'مرفوض'},
  ];

  widowService = new WidowService();
  destituteService = new DistituteService();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private reqService: RequestService,
    private requestFileService: RequestFileService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinner.show();

    this.req_id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Request ID:', this.req_id);

    this.reqService.findById(this.req_id).then(resp => {
      this.request = resp.data;
      console.log('Request Data:', this.request);
    }).finally(() => {
      this.spinner.hide();
      this.isLoading = false;
    });

    console.log('User Role:', this.role);
  }

  nameTransform(name: string): string {
    if (!name) return '--';
    const parts = name.toUpperCase().split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  }

  updateFileStatus(file: any) {
    console.log('Updating file:', file.id, file.status);

    this.requestFileService.updateStatus(file.id, file.status)
      .then(() => {
        console.log('updated')
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  }

  private buildWidowPayload() {
    return {
      name: this.request.widow.name,
      tel: this.request.widow.tel,
      cin: this.request.widow.cin,
      birth_date: this.request.widow.birth_date,
      orphans: this.request.widow.orphans.map((orphan: any) => ({
        full_name: orphan.full_name,
        birth_date: orphan.birth_date,
        is_studying: orphan.is_studying,
      })),
    };
  }

  private buildDestitutePayload() {
    return {
      name: this.request.destitute.name,
      tel: this.request.destitute.phone,
      cin: this.request.destitute.cin,
      birth_date: this.request.destitute.birth_date,
      husband: {
        name: this.request.destitute.husband.name,
        cin: this.request.destitute.husband.cin,
        tel: this.request.destitute.husband.phone,
        birth_date: this.request.destitute.husband.birth_date,
      }
    };
  }


  updateStatusAndGoBack(id: number, status: string) {
    this.reqService.updateStatus(id, status)
      .then(() => {
        alert('تم تحديث الحالة بنجاح!');

        if (this.role === 'admin' && this.request.application_type === 'يتيم_أرملة') {
          const widowPayload = this.buildWidowPayload();
          this.widowService.createWidow(widowPayload);
        } else {
          const destPayload = this.buildDestitutePayload();
          this.destituteService.create(destPayload);
        }

        setTimeout(() => {
          this.location.back();
        }, 1500);
      })
      .catch(error => {
        alert('فشل في تحديث الحالة. يرجى المحاولة لاحقًا.');
        console.error('Error updating status:', error);
      });
  }

  markAsComplete(id: number) {
    let status = this.role === 'writer' ? 'قيد_مراجعة_المسؤول' : 'قيد_التأكيد';
    this.updateStatusAndGoBack(id, status);
  }

  markAsIncomplete(id: number) {
    const status = this.role === 'writer' ? 'غير_مكتمل' : 'مرفوض';
    this.updateStatusAndGoBack(id, status);
  }

  isDisabled(): boolean {
    return ['قيد_مراجعة_المسؤول', 'مقبول', 'مرفوض'].includes(this.request.status);
  }

  markAsPending(id: number) {
    this.updateStatusAndGoBack(id, 'قيد_الانتظار');
  }

  updateNote(file: any) {
    this.requestFileService.addNote(file.id, file.note_admin).then(resp => {
      console.log(resp.data);
    });
  }

  protected readonly environment = environment;
}
