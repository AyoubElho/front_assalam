import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {Button} from 'primeng/button';
import {DatePipe, JsonPipe, NgIf} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Router} from '@angular/router';
import {OrphanService} from '../../../services/service/OrphanService';
import {Image} from 'primeng/image';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {Avatar} from 'primeng/avatar';
import {Location} from '@angular/common'; // Make sure this is imported

@Component({
  selector: 'app-orphan-create',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    Button,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    NgIf,
    MatSlideToggle,
    MatSelect,
    MatOption,
    MatLabel,
    MatError,
    Image,
    ReactiveFormsModule,
    Avatar
  ],
  providers: [DatePipe, provideNativeDateAdapter()],
  templateUrl: './orphan-create.component.html',
  styleUrls: ['./orphan-create.component.css']
})
export class OrphanCreateComponent {
  orphanForm: FormGroup;
  objectURL: string | null = null;
  loading = false;
  withoutPic = false;
  listGuardians: any = [];
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private orphanService: OrphanService,
    private location: Location // ✅ inject here

  ) {
    this.orphanForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      birth_date: ['', Validators.required],
      pic_orphan: [null],
      guardian_id: ['', Validators.required],
      mother_name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.objectURL = reader.result as string;
        this.orphanForm.patchValue({pic_orphan: this.file});
      };
      reader.readAsDataURL(this.file);
      this.withoutPic = false;
    }
  }

  withoutPicture(isChecked: boolean): void {
    this.withoutPic = isChecked;
    if (isChecked) {
      this.objectURL = null;
      this.file = null;
      this.orphanForm.patchValue({pic_orphan: null});
    }
  }

  get hasPicture(): boolean {
    return !!this.objectURL;
  }

  goBack(): void {
    this.location.back();
  }

  async create(): Promise<void> {
    if (this.orphanForm.invalid) {
      this.orphanForm.markAllAsTouched();
      return;
    }

    if (!this.withoutPic && !this.hasPicture) {
      alert('يرجى تحميل صورة أو اختيار "بدون صورة".');
      return;
    }

    this.loading = true;

    try {
      const formattedDate = this.datePipe.transform(
        this.orphanForm.get('birth_date')?.value,
        'yyyy-MM-dd'
      );

      // Create the orphan object
      const orphanData: any = {
        full_name: this.orphanForm.get('full_name')?.value,
        mother_name: this.orphanForm.get('mother_name')?.value,
        guardian_id: this.orphanForm.get('guardian_id')?.value,
        birth_date: formattedDate,
      };

      // Handle the image
      if (this.file && !this.withoutPic) {
        // Convert file to base64 if your backend expects it
        orphanData.pic_orphan = await this.fileToBase64(this.file);
      } else {
        orphanData.pic_orphan = null;
      }

      const response = await this.orphanService.create(orphanData);
      if (response.data) {
        alert('تمت إضافة اليتيم بنجاح.');
        this.router.navigate(['/admin/orphans']);
      } else {
        alert('فشل في إضافة اليتيم.');
      }
    } catch (err) {
      console.error('Error creating orphan:', err);
      alert('حدث خطأ أثناء إضافة اليتيم.');
    } finally {
      this.loading = false;
    }
  }

// Helper function to convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
