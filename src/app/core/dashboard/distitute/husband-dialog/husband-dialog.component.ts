import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-husband-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    MatDialogTitle
  ],
  template: `
    <div class="dialog-container" dir="rtl">
      <h2  class="dialog-title">معلومات الزوج</h2>
      <mat-dialog-content class="dialog-content">
        <div class="info-row">
          <span class="info-label">الاسم:</span>
          <span class="info-value">{{ data.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">رقم البطاقة:</span>
          <span class="info-value">{{ data.cin }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">الهاتف:</span>
          <span class="info-value">{{ data.tel }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">تاريخ الازدياد:</span>
          <span class="info-value">{{ data.birth_date }}</span>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-raised-button color="primary" mat-dialog-close class="close-button">
          إغلاق
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      font-family: 'Tajawal', 'Arial', sans-serif;
      width: 100%;
      max-width: 500px;
    }

    ::ng-deep .dialog-title {
      color: #3f51b5;
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
      font-family: "Tajawal", sans-serif;
      font-weight: 500;
      font-style: normal;
    }

    .dialog-content {
      padding: 15px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
      align-items: center;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: #555;
      margin-left: 15px;
    }

    .info-value {
      color: #333;
      text-align: left;
      direction: ltr;
    }

    .dialog-actions {
      padding: 15px 0 0 0;
      margin-top: 10px;
    }

    .close-button {
      padding: 8px 24px;
      border-radius: 4px;
    }
  `]
})
export class HusbandDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
