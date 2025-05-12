import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder, FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../services/service/AuthService';
import {User} from '../../models/User';
import {DatePipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {RequestService} from '../../services/service/RequestService';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatCheckbox} from '@angular/material/checkbox';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-application-submission',
  templateUrl: './application-submission.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    NgForOf,
    JsonPipe,
    MatIconModule,
    MatCheckbox,
    NgClass,
    DatePickerModule,
    NgStyle,

  ],
  providers: [DatePipe],
  styleUrls: ['./application-submission.component.css']
})
export class ApplicationSubmissionComponent implements OnInit {
  user!: User;
  requestForm: FormGroup;
  authService = new AuthService()
  requestService = new RequestService();

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {
    this.requestForm = this.fb.group({
      application_type: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^0?\d{9}$/)]],
      cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      birth_date: ['', Validators.required],
      husband_name: ['', Validators.required],
      husband_cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      husband_phone: ['', [Validators.required, Validators.pattern(/^0?\d{9}$/)]],
      husband_birth_date: ['', Validators.required],
      applicationRequest: [null, Validators.required],
      nationalCard: [null, Validators.required],
      civilStatus: [null, Validators.required],
      birthCertificate: [null, Validators.required],
      deathCertificate: [null, Validators.required],
      lifeCertificate: [null, Validators.required],
      goodConduct: [null, Validators.required],
      medicalCertificate: [null, Validators.required],
      marriageCertificate: [null, Validators.required],
      nonMarriageCertificate: [null, Validators.required],
      personalPhoto: [null, Validators.required],
      familyPhoto: [null, Validators.required],
      orphans: this.fb.array([], [
        this.minOrphans(1),
        this.atLeastOneStudyingOrphan()
      ])

    });

  }

  formatMoroccanPhoneNumber(rawPhone: string): string {
    let formattedPhone = rawPhone.trim();

    if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('+212')) {
      formattedPhone = formattedPhone.slice(4);
    }

    return '+212' + formattedPhone;
  }


  ngOnInit(): void {
    this.authService.user().then(response => {
      this.user = response.data;
      this.requestForm.patchValue({
        cin: this.user.cin,
        name: this.user.name
      });
    });

    this.requestForm.get('application_type')?.valueChanges.subscribe(value => {
      if (value !== 'يتيم_أرملة') {
        this.clearOrphans();
      } else {
        this.orphans
      }
    });
  }

  onOptionChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'يتيم_أرملة') {
      this.requestForm.get('husband_name')?.disable();
      this.requestForm.get('husband_cin')?.disable();
      this.requestForm.get('husband_phone')?.disable();
      this.requestForm.get('husband_birth_date')?.disable();
      this.requestForm.get('deathCertificate')?.enable();
      this.requestForm.get('medicalCertificate')?.disable();
      this.requestForm.get('nonMarriageCertificate')?.enable();
      this.requestForm.get('marriageCertificate')?.disable();
      this.requestForm.get('orphans')?.enable();


    } else {
      this.requestForm.get('husband_name')?.enable();
      this.requestForm.get('husband_cin')?.enable();
      this.requestForm.get('husband_phone')?.enable();
      this.requestForm.get('husband_birth_date')?.enable();
      this.requestForm.get('deathCertificate')?.disable();
      this.requestForm.get('medicalCertificate')?.enable();
      this.requestForm.get('nonMarriageCertificate')?.disable();
      this.requestForm.get('marriageCertificate')?.enable();
      this.requestForm.get('orphans')?.disable();
    }
  }


  get orphans(): FormArray {
    return this.requestForm.get('orphans') as FormArray;
  }

  addOrphan(): void {
    const orphanGroup = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      birth_date: ['', [Validators.required]],
      is_studying: [false]

    });
    this.orphans.push(orphanGroup);
  }

  removeOrphan(index: number): void {
    this.orphans.removeAt(index);
  }

  clearOrphans(): void {
    while (this.orphans.length !== 0) {
      this.orphans.removeAt(0);
    }
  }

  onFileChange(event: any, controlName: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.requestForm.get(controlName)?.setValue(file);
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


  onSubmit() {

    if (this.requestForm.valid) {
      const formData = new FormData();
      formData.append('application_type', this.requestForm.get('application_type')?.value);

      if (this.requestForm.get('application_type')?.value === 'يتيم_أرملة') {
        formData.append('widow[name]', this.requestForm.get('name')?.value);
        formData.append('widow[tel]', this.formatMoroccanPhoneNumber(this.requestForm.get('phone')?.value));
        formData.append('widow[cin]', this.requestForm.get('cin')?.value);
        const widowBirthDate = this.datePipe.transform(this.requestForm.get('birth_date')?.value, 'yyyy-MM-dd');
        formData.append('widow[birth_date]', widowBirthDate || '');

        const orphansArray = this.orphans.value;
        orphansArray.forEach((orphan: any, index: number) => {
          const formattedOrphanBirthDate = this.datePipe.transform(orphan.birth_date, 'yyyy-MM-dd') || '';
          formData.append(`widow[orphans][${index}][name]`, orphan.full_name);
          formData.append(`widow[orphans][${index}][birth_date]`, formattedOrphanBirthDate);
          formData.append(`widow[orphans][${index}][is_studying]`, orphan.is_studying ? '1' : '0');
        });


      } else {
        formData.append('name', this.requestForm.get('name')?.value);
        formData.append('phone', this.formatMoroccanPhoneNumber(this.requestForm.get('phone')?.value));
        formData.append('cin', this.requestForm.get('cin')?.value);
        const formattedBirthDate = this.datePipe.transform(this.requestForm.get('birth_date')?.value, 'yyyy-MM-dd');
        formData.append('birth_date', formattedBirthDate || '');
        formData.append('husband[name]', this.requestForm.get('husband_name')?.value);
        formData.append('husband[phone]', this.formatMoroccanPhoneNumber(this.requestForm.get('husband_phone')?.value));
        formData.append('husband[cin]', this.requestForm.get('husband_cin')?.value);
        const husbandBirthDate = this.datePipe.transform(this.requestForm.get('husband_birth_date')?.value, 'yyyy-MM-dd');
        formData.append('husband[birth_date]', husbandBirthDate || '');
      }

      const fileMappings = [
        {control: 'applicationRequest', type: 'طلب_الترشيح'},
        {control: 'nationalCard', type: 'البطاقة_الوطنية'},
        {control: 'civilStatus', type: 'الحالة_المدنية'},
        {control: 'birthCertificate', type: 'عقد_الازدياد'},
        {control: 'deathCertificate', type: 'شهادة_الوفاة'},
        {control: 'lifeCertificate', type: 'شهادة_الحياة'},
        {control: 'goodConduct', type: 'شهادة_حسن_السيرة'},
        {control: 'medicalCertificate', type: 'شهادة_طبية'},
        {control: 'marriageCertificate', type: 'عقد_الزواج'},
        {control: 'nonMarriageCertificate', type: 'شهادة_عدم_الزواج'},
        {control: 'personalPhoto', type: 'صورة_شخصية'},
        {control: 'familyPhoto', type: 'صورة_عائلية'}
      ];

      fileMappings.forEach((mapping, index) => {
        const file = this.requestForm.get(mapping.control)?.value;
        if (file) {
          formData.append(`list_files[${index}][file]`, file);
          formData.append(`list_files[${index}][file_type]`, mapping.type);
        }
      });

      this.requestService.createRequest(formData)
        .then(response => {
          this.requestForm.reset();
        })
        .catch(error => {
          if (error.response) {
            console.error('Error response data:', error.response.data);
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Request setup error:', error.message);
          }
        });

    } else {
      this.requestForm.markAllAsTouched();
    }
  }


}
