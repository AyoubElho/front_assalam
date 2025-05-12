import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {DatePipe, JsonPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {provideNativeDateAdapter} from '@angular/material/core';
import {WidowService} from '../../../services/service/WidowService';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-window-create',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    InputTextModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    MatIconModule,
    MatCheckboxModule,
    JsonPipe,
    NgClass,
    MatTooltipModule
  ],
  templateUrl: './window-create.component.html',
  styleUrls: ['./window-create.component.css'],
  providers: [DatePipe, provideNativeDateAdapter()],
})
export class WindowCreateComponent implements OnInit {
  loading: boolean = false;
  widowForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private widowService: WidowService) {
    this.widowForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[\u0600-\u06FF\s]+$/)]],
      cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z][0-9]{6}$/)]],
      birth_date: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      children: this.fb.array(
        [this.newChild()], // initial child
        [this.minOrphans(1), this.atLeastOneStudyingOrphan()] // validators
      )

    });
  }


  ngOnInit(): void {
  }

  get children(): FormArray {
    return this.widowForm.get('children') as FormArray;
  }

  newChild(): FormGroup {
    return this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[\u0600-\u06FF\s]+$/)]],
      birth_date: ['', [Validators.required]],
      is_studying: [false]
    });
  }

  addChild(): void {
    this.children.push(this.newChild());
  }

  removeChild(index: number): void {
    if (this.children.length > 1) {
      this.children.removeAt(index);
    }
  }

  minOrphans(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const array = control as FormArray;
      return array.length >= min ? null : {minOrphans: {required: min, actual: array.length}};
    };
  }


  atLeastOneStudyingOrphan(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const orphans = (formArray as FormArray).controls;
      const hasStudying = orphans.some(orphan =>
        orphan.get('is_studying')?.value === true
      );

      return hasStudying ? null : { noStudyingOrphan: true };
    };
  }

  goBack(): void {
    this.router.navigate(['/dashboard/widows']);
  }

  submitForm(): void {
    if (this.widowForm.valid) {
      this.loading = true;

      const formData = {
        name: this.widowForm.value.full_name,
        cin: this.widowForm.value.cin,
        birth_date: this.formatDate(this.widowForm.value.birth_date),
        tel: '+212' + this.widowForm.value.tel,
        orphans: this.widowForm.value.children.map((child: any) => ({
          full_name: child.full_name,
          birth_date: this.formatDate(child.birth_date),
          is_studying: child.is_studying
        }))
      };
      this.widowService.createWidow(formData)
        .then(() => {
          this.loading = false;
          this.router.navigate(['/dashboard/widows']);
        })
        .catch(error => {
          this.loading = false;
          console.error('Error creating widow:', error);
          // Add error handling UI feedback here
        });
    } else {
      this.widowForm.markAllAsTouched();
    }
  }

  private formatDate(date: any): string {
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }
    return date; // Assuming it's already in correct format if not a Date object
  }
}
