import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {OrphanService} from '../../../../../service/OrphanService';

@Component({
  selector: 'app-home',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  count = 0
  oS = new OrphanService()

  ngOnInit() {
    this.oS.count().then(responce => {
      this.count = responce.data
    })
  }
}
