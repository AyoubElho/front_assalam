import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {initFlowbite} from 'flowbite';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ConfirmationService, MessageService} from 'primeng/api';
import {NgxFastMarqueeModule} from 'ngx-fast-marquee';
import {provideNativeDateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, NgxFastMarqueeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ConfirmationService, MessageService]

})
export class AppComponent implements OnInit {
  token = localStorage.getItem('jwt');
  role = localStorage.getItem('role');

  ngOnInit(): void {
    initFlowbite();
  }
}
