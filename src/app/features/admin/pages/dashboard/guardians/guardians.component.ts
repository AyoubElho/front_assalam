import {Component, OnInit} from '@angular/core';
import {GuardianService} from '../../../../../service/GuardianService';

@Component({
  selector: 'app-guardians',
  imports: [],
  templateUrl: './guardians.component.html',
  styleUrl: './guardians.component.css'
})
export class GuardiansComponent implements OnInit {
  guardianService: GuardianService = new GuardianService();
  listGuardians: any = []

  ngOnInit(): void {
    this.guardianService.getAll().then(responce => {
      this.listGuardians = responce.data;
      console.log(responce.data)
    })
  }


}
