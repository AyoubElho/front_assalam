import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {JsonPipe, NgForOf} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {TableModule} from 'primeng/table';
import {OrphanService} from '../../../../../../service/OrphanService';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import "primeicons/primeicons.css";
import {SplitButton} from 'primeng/splitbutton';
import {RouterLink} from '@angular/router';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Orphan} from '../../../../../../service/Orphan';
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";


@Component({
  selector: 'app-orphanes',
  templateUrl: './orphanes.component.html',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    TableModule,
    Avatar,
    Button,
    SplitButton,
    RouterLink,
    IconField,
    InputIcon,
    InputText,
    JsonPipe
  ],
  styleUrls: ['./orphanes.component.css']
})
export class OrphanesComponent implements AfterViewInit, OnInit {

  list: Orphan[] = [];
  orphanService = new OrphanService();
  displayedColumns: string[] = ['id', 'age', 'guardian_name', 'mother_name', 'name'];
  dataSource = new MatTableDataSource<Orphan>(this.list);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit(): Promise<void> {
    try {
      this.orphanService.getAll().then(responce => {
        this.list = responce.data;
      });
    } catch (error) {
      console.error("Erreur lors du chargement des orphelins", error);
    }
  }

  getAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  protected readonly HTMLInputElement = HTMLInputElement;
    protected readonly log = log;
}
