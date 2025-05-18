import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {JsonPipe, NgClass, NgIf} from '@angular/common';
import {Calendar} from 'primeng/calendar';
import {DistituteService} from '../../../services/service/DistituteService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-distiute-create',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    JsonPipe,
    NgIf,
    Calendar,
    NgClass
  ],
  templateUrl: './distiute-create.component.html',
  styleUrl: './distiute-create.component.css'
})
export class DistiuteCreateComponent {
  loading = false;
  distituteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private distituteService: DistituteService,
    private router: Router) {
    this.distituteForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      cin: ['', [Validators.required]],
      birth_date: ['', Validators.required],
      tel: ['', [Validators.pattern(/^0[5-7][0-9]{8}$/)]],
      husband_full_name: [''],
      husband_cin: [''],
      husband_birth_date: [''],
      husband_tel: ['']
    });
  }

  submitForm() {
    if (this.distituteForm.valid) {
      this.loading = true;

      const formValue = this.distituteForm.value;

      const payload = {
        name: formValue.full_name,
        cin: formValue.cin,
        birth_date: formValue.birth_date,
        tel: "+212" + formValue.tel,
        husband: {
          name: formValue.husband_full_name,
          cin: formValue.husband_cin,
          birth_date: formValue.husband_birth_date,
          tel: '+212' + formValue.husband_tel
        }
      };

      this.distituteService.create(payload)
        .then((response: any) => {
          this.router.navigate(['/dashboard/distitutes']); // remplace par l'URL souhaitée
        })
        .catch((error: any) => {
          // gestion des erreurs
        })
        .finally(() => {
          this.loading = false;
        });

    } else {
      this.distituteForm.markAllAsTouched();
    }
  }


  goBack() {
    console.log('Going back');
  }
}
