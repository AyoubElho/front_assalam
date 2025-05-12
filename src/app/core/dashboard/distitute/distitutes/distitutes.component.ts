import {AfterViewInit, Component, inject, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {OrphanService} from '../../../services/service/OrphanService';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatPaginator} from '@angular/material/paginator';
import {DistituteService} from '../../../services/service/DistituteService';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {HusbandDialogComponent} from '../husband-dialog/husband-dialog.component';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DistituteEditDialogComponent} from './distitute-edit-dialog.component';
import {Route, Router, RouterLink} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-distitutes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatIconButton,
    MatIconModule,
    MatButton,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    Button,
    RouterLink
  ],
  templateUrl: './distitutes.component.html',
  styleUrl: './distitutes.component.css'
})
export class DistitutesComponent implements OnInit, AfterViewInit {
  private distituteService = inject(DistituteService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private dialog = inject(MatDialog);
  private spinner = inject(NgxSpinnerService);
  router = inject(Router);
  role: string | null = ''

  displayedColumns: string[] = ['name', 'cin', 'tel', 'birth_date', 'husband_info', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.role = localStorage.getItem('role'); // Assuming role is stored as 'role'

    this.spinner.show();
    await this.loadDistitutes();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async loadDistitutes() {
    try {
      const resp = await this.distituteService.getAll();
      this.dataSource.data = resp.data.distitutes;
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

  openHusbandDialog(husband: any) {
    if (!husband) return;
    this.dialog.open(HusbandDialogComponent, {
      data: husband
    });
  }

  editDistitute(element: any) {
    console.log(element)
    const dialogRef = this.dialog.open(DistituteEditDialogComponent, {
      data: {...element}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDistitutes();
      }
    });
  }

  deleteDistitute(id: any) {
    // Show confirmation dialog before proceeding with deletion
    const confirmation = window.confirm('Are you sure you want to delete this destitute?');

    if (confirmation) {
      this.spinner.show(); // Show spinner while deleting
      this.distituteService.delete(id)  // Call the delete service method
        .then(() => {
          this.loadDistitutes(); // Reload the list after successful deletion
          this.spinner.hide(); // Hide spinner
        })
        .catch((error: any) => {
          console.error('Error deleting destitute:', error);
          this.spinner.hide(); // Hide spinner in case of an error
        });
    }
  }

  exportToCSV() {
    const headers = ['الاسم', 'رقم البطاقة', 'الهاتف', 'تاريخ الازدياد', 'معلومات الزوج'];

    const rows = this.dataSource.data.map((distitute: any) => [
      distitute.name || '',
      distitute.cin || '',
      (distitute.tel || '').replace('+', '00'),
      new Date(distitute.birth_date).toLocaleDateString('ar-MA'),
      distitute.husband ? `${distitute.husband.name || ''} - ${distitute.husband.cin || ''}` : ''
    ]);

    let csvContent = '\uFEFF' + headers.join(',') + '\n'; // \uFEFF for Arabic encoding

    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'distitutes_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  createDistitute() {
    this.router.navigate(['/dashboard/distitute/create']);
  }
}
