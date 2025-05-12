import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-widow-orphans-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogContent,
    NgIf,
    NgForOf,
    MatDialogTitle,
    MatTableModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">أيتام الأرملة</h2>
      <mat-dialog-content dir="rtl">
        <div *ngIf="data.orphans.length > 0; else noOrphans">
          <table mat-table [dataSource]="data.orphans" class="mat-elevation-z8 orphan-table">

            <!-- Full Name Column -->
            <ng-container matColumnDef="full_name">
              <th mat-header-cell *matHeaderCellDef class="header-cell">الاسم الكامل</th>
              <td mat-cell *matCellDef="let orphan" class="cell">{{ orphan.full_name }}</td>
            </ng-container>

            <!-- Birth Date Column -->
            <ng-container matColumnDef="birth_date">
              <th mat-header-cell *matHeaderCellDef class="header-cell">تاريخ الميلاد</th>
              <td mat-cell *matCellDef="let orphan" class="cell">{{ orphan.birth_date | date:'longDate' }}</td>
            </ng-container>

            <!-- Age Column -->
            <ng-container matColumnDef="age">
              <th mat-header-cell *matHeaderCellDef class="header-cell">العمر</th>
              <td mat-cell *matCellDef="let orphan" class="cell">{{ calculateAge(orphan.birth_date) }} سنة</td>
            </ng-container>

            <!-- Is Studying Column -->
            <ng-container matColumnDef="is_studying">
              <th mat-header-cell *matHeaderCellDef class="header-cell">يدرس؟</th>
              <td mat-cell *matCellDef="let orphan" class="cell">{{ orphan.is_studying ? 'نعم' : 'لا' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="row"></tr>
          </table>
        </div>
        <ng-template #noOrphans>
          <div class="no-orphans-container">
            <p class="no-orphans">لا يوجد أيتام</p>
          </div>
        </ng-template>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .dialog-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 0 16px;
    }

    .dialog-title {
      text-align: center;
      color: #3f51b5;
      font-weight: 500;
      padding: 16px 0;
      margin: 0;
      font-size: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .orphan-table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      margin: 16px 0;
    }

    .header-row {
      background-color: #3f51b5;
    }

    .header-cell {
      color: white !important;
      font-size: 1rem;
      font-weight: 500;
      padding: 12px 16px !important;
    }

    .row:nth-child(even) {
      background-color: #f5f5f5;
    }

    .row:hover {
      background-color: #e8eaf6;
    }

    .cell {
      padding: 12px 16px !important;
      font-size: 0.95rem;
      color: #424242;
    }

    .no-orphans-container {
      padding: 32px;
      text-align: center;
    }

    .no-orphans {
      font-size: 1.1rem;
      color: #757575;
      font-style: italic;
      margin: 0;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .dialog-container {
        min-width: unset;
        width: 100%;
      }

      .header-cell, .cell {
        padding: 8px 12px !important;
        font-size: 0.85rem;
      }

      .dialog-title {
        font-size: 1.2rem;
      }
    }
  `]
})
export class WidowOrphansDialogComponent {
  displayedColumns: string[] = ['full_name', 'birth_date', 'age', 'is_studying'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { orphans: any[] }) {}

  calculateAge(birthDate: string | Date): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }
}
