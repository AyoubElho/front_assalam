import {Component, OnInit, inject} from '@angular/core';
import {RequestService} from '../../../services/service/RequestService';
import {ActivatedRoute} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  imports: [
    NgIf
  ],
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {

  requetsService = inject(RequestService);
  private req_id!: number;
  private confirme = 'مقبول';

  success = false;
  error = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.verify();
  }

  verify() {
    this.req_id = +this.route.snapshot.paramMap.get('code')!;
    this.requetsService.updateStatus(this.req_id, this.confirme)
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.error = true;
      });
  }
}
