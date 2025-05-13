import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe, JsonPipe, NgForOf, NgOptimizedImage} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {TableModule} from 'primeng/table';
import {OrphanService} from '../../../services/service/OrphanService';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {SplitButton} from 'primeng/splitbutton';
import {RouterLink} from '@angular/router';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Orphan} from '../../../models/Orphan';
import {Dialog} from 'primeng/dialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {WidowService} from '../../../services/service/WidowService';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatIcon} from '@angular/material/icon';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {BarChartModule} from "@swimlane/ngx-charts";


@Component({
  selector: 'app-orphanes',
  templateUrl: './orphanes.component.html',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    TableModule,
    MatSort,
    MatSortHeader,
    BarChartModule,
  ],
  providers: [ConfirmationService, MessageService],
  styleUrls: ['./orphanes.component.css']
})
export class OrphanesComponent implements AfterViewInit, OnInit {

  private orphanService = inject(OrphanService);
  private _liveAnnouncer = inject(LiveAnnouncer);

  constructor(private spinner: NgxSpinnerService) {
  }

  displayedColumns: string[] = ['full_name', 'age','birth_date', 'is_studying', 'widowName'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    await this.loadWidows(); // Wait for data to load
    this.spinner.hide();     // Then hide the spinner
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async loadWidows() {
    try {
      const resp = await this.orphanService.getAll();
      this.dataSource.data = resp.data.map((orphan: any) => ({
        ...orphan,
        age: this.calculateAge(orphan.birth_date),
        widowName: orphan.widow.name,
      }));
      console.log(this.dataSource.data)
    } catch (error) {
      console.error('Error loading widows:', error);
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
