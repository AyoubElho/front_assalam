import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {CategoryService} from '../../../../../services/service/CategoryService';

@Component({
  selector: 'app-create-category-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  template: `
    <div class="p-4 w-full" dir="rtl">
      <h2 class="text-center mt-4 !text-[#3f51b5] text-2xl font-semibold ">إضافة فئة جديدة</h2>
      <form class="mt-4" [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-full mb-4">
          <input
            matInput
            placeholder="اسم الفئة"
            formControlName="name"
            dir="rtl"
          />
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            اسم الفئة مطلوب
          </mat-error>
        </mat-form-field>

        <div class="flex justify-end gap-2">
          <button
            mat-stroked-button
            type="button"
            (click)="onClose()"
            class="px-4"
          >
            إلغاء
          </button>
          <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="form.invalid || loading"
            class="px-4"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .mat-mdc-form-field {
      width: 100%;
    }
    button[mat-flat-button] {
      margin-right: 8px;
    }
  `]
})
export class CreateCategoryDialogComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    private categoryService: CategoryService

  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const name = this.form.value.name;

    this.categoryService.createCategory(name).then(res => {
      this.dialogRef.close(res.data); // close and return the created category
    }).catch(() => {
      alert("فشل في إنشاء الفئة.");
    }).finally(() => {
      this.loading = false;
    });
  }


  onClose() {
    this.dialogRef.close();
  }
}
