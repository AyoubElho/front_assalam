import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-event-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-container" dir="rtl">
      <h2 class="dialog-title">{{ !data.event ? 'إنشاء حدث جديد' : 'تعديل الحدث' }}</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="event-form">
        <div class="form-group">
          <label for="title">عنوان الحدث*</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="أدخل عنوان الحدث"
            class="form-input"
            [class.error]="form.get('title')?.invalid && form.get('title')?.touched"
          >
          <div class="error-message" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
            العنوان مطلوب
          </div>
        </div>

        <div class="form-group">
          <label for="description">الوصف</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="أضف تفاصيل الحدث"
            class="form-input textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="date-row">
          <div class="form-group">
            <label for="start">تاريخ البدء*</label>
            <input
              id="start"
              type="date"
              formControlName="start"
              class="form-input"
              [class.error]="form.get('start')?.invalid && form.get('start')?.touched"
              [disabled]="true"
            >
            <div class="error-message" *ngIf="form.get('start')?.invalid && form.get('start')?.touched">
              تاريخ البدء مطلوب
            </div>
          </div>

          <div class="form-group">
            <label for="end">تاريخ الانتهاء*</label>
            <input
              id="end"
              type="date"
              formControlName="end"
              class="form-input"
              [class.error]="form.get('end')?.invalid && form.get('end')?.touched"
              (change)="updateEndDateValidator()"
            >
            <div class="error-message" *ngIf="form.get('end')?.errors?.['required'] && form.get('end')?.touched">
              تاريخ الانتهاء مطلوب
            </div>
            <div class="error-message" *ngIf="form.get('end')?.errors?.['invalidDate']">
              يجب أن يكون تاريخ الانتهاء بعد أو يساوي تاريخ البدء
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="location">الموقع</label>
          <input
            id="location"
            type="text"
            formControlName="location"
            placeholder="أين سيقام الحدث؟"
            class="form-input"
          >
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" (click)="close()">إلغاء</button>
          <button type="submit" class="submit-btn" [disabled]="form.invalid">
            {{ data.event ? 'تحديث الحدث' : 'إنشاء الحدث' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      min-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .dialog-title {
      margin: 0 0 20px 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    .event-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.9rem;
      color: #555;
      font-weight: 500;
    }

    .form-input {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }

    .form-input.error {
      border-color: #e74c3c;
    }

    .form-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }

    .form-input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .textarea {
      min-height: 80px;
      resize: vertical;
    }

    .date-row {
      display: flex;
      gap: 15px;
    }

    .date-row .form-group {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }

    .cancel-btn {
      padding: 8px 16px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .cancel-btn:hover {
      background: #eaeaea;
    }

    .submit-btn {
      padding: 8px 16px;
      background: #4a90e2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .submit-btn:hover {
      background: #3a7bc8;
    }

    .submit-btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 4px;
    }
  `]
})
export class CreateEventDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    const isEditMode = !!data.event;  // Check if it's in edit mode (data.event exists)

    // Initialize the form group
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      start: [null, [Validators.required]],
      end: [null, [Validators.required]],
      location: ['']
    });

    // Set start and end dates based on edit mode
    if (isEditMode) {
      this.form.patchValue({
        title: data.event.title,
        description: data.event.description,
        start: this.formatDate(data.event.start),  // Set start date from event
        end: this.formatDate(data.event.end),      // Set end date from event
        location: data.event.location
      });

      // Disable start and end fields in edit mode
      this.form.controls['start'].disable();
      this.form.controls['end'].disable();
    } else {
      // If not in edit mode, set start and end to a default value
      const currentDate = this.formatDate(data.date || new Date());
      this.form.patchValue({
        start: currentDate,
        end: currentDate
      });
    }
  }


  private formatDate(date: any): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // → 'YYYY-MM-DD'
  }

  // Custom validator for date comparison
  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('start')?.value;
    const endDate = control.get('end')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        control.get('end')?.setErrors({ invalidDate: true });
        return { invalidDate: true };
      }
    }

    return null;
  }

  // Update validator when end date changes
  updateEndDateValidator(): void {
    const startDate = this.form.get('start')?.value;
    const endDate = this.form.get('end')?.value;

    if (startDate && endDate) {
      this.form.updateValueAndValidity();
    }
  }

  submit() {
    if (this.form.valid) {
      // Enable the disabled field before submitting
      const formValue = this.form.getRawValue();
      this.dialogRef.close(formValue);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
