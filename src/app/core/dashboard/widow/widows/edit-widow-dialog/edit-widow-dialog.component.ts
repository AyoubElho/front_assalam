import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { WidowService } from '../../../../services/service/WidowService';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-widow-dialog',
  providers: [provideNativeDateAdapter()],

  template: `
    <h2 mat-dialog-title>تحديث معلومات الأرملة</h2>

    <mat-dialog-content dir="rtl">
      <form [formGroup]="form" class="flex flex-col gap-4 mt-4">
        <mat-form-field appearance="fill">
          <mat-label>الاسم</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="form.get('name')?.hasError('required')">الاسم مطلوب</mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('minlength')">الاسم يجب أن يكون على الأقل 3 أحرف</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>الهاتف</mat-label>
          <input matInput formControlName="tel" required>
          <mat-error *ngIf="form.get('tel')?.hasError('required')">الهاتف مطلوب</mat-error>
          <mat-error *ngIf="form.get('tel')?.hasError('pattern')">رقم الهاتف غير صالح</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>رقم البطاقة</mat-label>
          <input matInput formControlName="cin" required>
          <mat-error *ngIf="form.get('cin')?.hasError('required')">رقم البطاقة مطلوب</mat-error>
          <mat-error *ngIf="form.get('cin')?.hasError('pattern')">رقم البطاقة غير صالح</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>تاريخ الازدياد</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birth_date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="form.get('birth_date')?.hasError('required')">تاريخ الازدياد مطلوب</mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">إلغاء</button>
      <button mat-button color="primary" (click)="save()">حفظ</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogActions,
    MatButton,
    MatFormFieldModule,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepicker,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    NgIf // Make sure NgIf is here
  ],
})
export class EditWidowDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditWidowDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widowService: WidowService
  ) {
    this.form = this.fb.group({
      id: [data.id],
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      tel: [data.tel, [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]], // Valid phone pattern
      cin: [data.cin, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]], // Alphanumeric CIN pattern
      is_supported: [data.is_supported],
      birth_date: [data.birth_date, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      // Send form data to the parent component
      this.dialogRef.close(this.form.value);
    } else {
      // Optionally show validation errors
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
