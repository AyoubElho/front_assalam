import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {OrphanService} from '../../../../../../service/OrphanService';
import {JsonPipe} from '@angular/common';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-orphan-detaill',
  imports: [
    JsonPipe,
  ],
  templateUrl: './orphan-detaill.component.html',
  styleUrl: './orphan-detaill.component.css'
})
export class OrphanDetaillComponent implements OnInit {
  orphanId!: number;
  orphanService = new OrphanService();

  object = {}

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.orphanId = <number><unknown>this.route.snapshot.paramMap.get('id')!;
    this.orphanService.findById(this.orphanId).then(responce => {
      this.object = responce.data
    })
  }
}
