import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {DistituteService} from '../../../services/service/DistituteService';

@Component({
  selector: 'app-distitute-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle
  ],
  template: `
    <h2 mat-dialog-title class="text-center">تعديل معلومات المستفيدة</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" dir="rtl" style="padding: 20px;">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>الاسم الكامل</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>رقم البطاقة الوطنية</mat-label>
        <input matInput formControlName="cin" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>رقم الهاتف</mat-label>
        <input matInput formControlName="tel" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>تاريخ الازدياد</mat-label>
        <input matInput type="date" formControlName="birth_date" />
      </mat-form-field>

      <div style="margin-top: 20px; text-align: end;">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">حفظ</button>
        <button mat-raised-button mat-dialog-close type="button" style="margin-right: 10px;">إلغاء</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class DistituteEditDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private distituteService: DistituteService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DistituteEditDialogComponent>
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      cin: [data.cin, Validators.required],
      tel: [data.tel, Validators.required],
      birth_date: [data.birth_date, Validators.required],
      husband_id: [data.husband_id]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.distituteService.update(this.data.id, this.form.value).then((response:any) => {
        this.dialogRef.close(response.data); // Close and return updated data
      }).catch((error:any) => {
        console.error("Update failed:", error);
        // You could add error handling UI here
      });
    }
  }
}
