// create-user-dialog.component.ts
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/service/AuthService';
import {JsonPipe, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],

  imports: [
    ReactiveFormsModule,
    NgIf,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    JsonPipe,
    MatIconButton,
    MatOption,
    MatSelectModule,
    MatButton
  ],
  template: `
    <div dir="rtl" class="p-6 w-full max-w-[500px] bg-white rounded-xl font-['Inter'] shadow-lg">
      <h2 class="mb-6 text-center !text-[#3f51b5] text-2xl font-semibold ">إنشاء مستخدم جديد</h2>
      <form [formGroup]="userForm" class="grid gap-5">
        <!-- الاسم -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>الاسم الكامل</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="userForm.get('name')?.hasError('required') && userForm.get('name')?.touched">
            الاسم مطلوب
          </mat-error>
        </mat-form-field>

        <!-- البريد الإلكتروني -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>البريد الإلكتروني</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="userForm.get('email')?.hasError('required') && userForm.get('email')?.touched">
            البريد الإلكتروني مطلوب
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email') && userForm.get('email')?.touched">
            يرجى إدخال بريد إلكتروني صحيح
          </mat-error>
        </mat-form-field>

        <!-- تاريخ الميلاد -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>تاريخ الميلاد</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birth_date" placeholder="اختر تاريخ">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="userForm.get('birth_date')?.hasError('required') && userForm.get('birth_date')?.touched">
            تاريخ الميلاد مطلوب
          </mat-error>
        </mat-form-field>

        <!-- الدور -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>الدور</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="">-- اختر دور --</mat-option>
            <mat-option value="admin">مشرف</mat-option>
            <mat-option value="writer">كاتب</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required') && userForm.get('role')?.touched">
            الدور مطلوب
          </mat-error>
        </mat-form-field>

        <!-- كلمة المرور -->
        <mat-form-field appearance="fill" class="w-full">
          <mat-label>كلمة المرور</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
          <button mat-icon-button matSuffix type="button" (click)="generatePassword()">
            <mat-icon>autorenew</mat-icon>
          </button>
          <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          <mat-error *ngIf="userForm.get('password')?.hasError('required') && userForm.get('password')?.touched">
            كلمة المرور مطلوبة
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('minlength') && userForm.get('password')?.touched">
            يجب أن تتكون كلمة المرور من 8 أحرف على الأقل
          </mat-error>
          <mat-error *ngIf="userForm.get('password')?.hasError('pattern') && userForm.get('password')?.touched">
            يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام
          </mat-error>
        </mat-form-field>

      </form>

      <!-- الأزرار -->
      <div class="flex justify-end gap-3 mt-6">
        <button mat-stroked-button (click)="dialogRef.close()">إلغاء</button>
        <button mat-raised-button color="primary" [disabled]="userForm.invalid" (click)="createUser()">
          إنشاء مستخدم
        </button>
      </div>
    </div>

  `,
  styles: [] // مصفوفة الأنماط فارغة حيث نستخدم Tailwind
})
export class CreateUserDialogComponent {
  userForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birth_date: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
      ]]
    });
  }

  generatePassword(): void {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const allChars = uppercase + lowercase + digits;

    // التأكد من وجود حرف كبير وصغير ورقم على الأقل
    const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
    const requiredChars = [
      getRandom(uppercase),
      getRandom(lowercase),
      getRandom(digits)
    ];

    // توليد بقية الأحرف عشوائياً
    const remainingLength = 8; // الطول الكامل المطلوب
    for (let i = requiredChars.length; i < remainingLength; i++) {
      requiredChars.push(getRandom(allChars));
    }

    // خلط الأحرف لجعل كلمة المرور غير متوقعة
    const shuffled = requiredChars.sort(() => 0.5 - Math.random()).join('');

    this.userForm.patchValue({password: shuffled});
    this.userForm.get('password')?.markAsTouched();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  createUser(): void {
    if (this.userForm.invalid) return;

    const newUser = this.userForm.value;
    const rawDate: Date = this.userForm.get('birth_date')?.value;
    const formattedDate = rawDate.toISOString().split('T')[0]; // "2022-05-08"
    const payload = {
      ...newUser,
      birth_date: formattedDate, // 👈 حقن التاريخ المنسق هنا
      password_confirmation: newUser.password
    }
    console.log(payload)
    this.authService.register(payload).then(() => {
      this.dialogRef.close(true);
    }).catch(err => {
      console.error('خطأ في إنشاء المستخدم:', err);
    });
  }
}
