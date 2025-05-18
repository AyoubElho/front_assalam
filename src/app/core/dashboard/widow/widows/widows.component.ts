import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {WidowService} from '../../../services/service/WidowService';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatIcon} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatTableDataSource} from '@angular/material/table';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {Button} from "primeng/button";
import {NgxSpinnerService} from 'ngx-spinner';
import {MatDialog} from '@angular/material/dialog';
import {WidowOrphansDialogComponent} from './WidowOrphansDialogComponent';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {EditWidowDialogComponent} from './edit-widow-dialog/edit-widow-dialog.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-widows',
  standalone: true,
  imports: [
    DatePipe,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatIcon,
    MatButtonModule,
    RouterLink,
    MatSortModule,
    MatFormField,
    MatInputModule,
    Button,
    NgClass,
    NgIf,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    Select,
    // Import ConfirmDialogModule
  ],
  templateUrl: './widows.component.html',
  styleUrls: ['./widows.component.css'],
  providers: [ConfirmationService], // Provide the confirmation service
})
export class WidowsComponent implements OnInit, AfterViewInit {
  private widowService = inject(WidowService);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private spinner = inject(NgxSpinnerService);
  private dialog = inject(MatDialog);
  private confirmationService = inject(ConfirmationService); // Inject confirmation service

  originalData: any[] = [];
  role: string | null = '';
  displayedColumns: string[] = ['name', 'cin', 'tel', 'age', 'countOrphan', 'is_supported', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.role = localStorage.getItem('role');
    this.spinner.show();
    await this.loadWidows();
    this.spinner.hide();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async loadWidows() {
    try {
      const resp = await this.widowService.getAllWidows();
      this.originalData = resp.data.data.map((widow: any) => ({
        ...widow,
        countOrphan: widow.orphans?.length || 0,
        age: this.getAge(widow.birth_date)
      }));

      this.dataSource.data = this.originalData;
    } catch (error) {
      console.error('Error loading widows:', error);
    }
  }

  getAge(birthDateString: string): number | string {
    if (!birthDateString) return 'غير معروف';

    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  exportToCSV() {
    const headers = ['الاسم', 'رقم البطاقة', 'الهاتف', 'عدد الأيتام', 'مدعومة', 'تاريخ الإضافة'];

    const rows = this.dataSource.filteredData.map(widow => [
      widow.name,
      widow.cin,
      widow.tel.replace('+', '00'),
      widow.countOrphan,
      widow.is_supported === 1 ? 'نعم' : 'لا',
      new Date(widow.created_at).toLocaleDateString('ar-MA')
    ]);

    let csvContent = '\uFEFF' + headers.join(',') + '\n'; // \uFEFF ensures Arabic characters display correctly

    rows.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'widows_filtered_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  openOrphansDialog(widow: any) {
    this.dialog.open(WidowOrphansDialogComponent, {
      data: {orphans: widow.orphans || []}
    });
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

  supportOptions = [
    {label: 'الكل', value: 'all'},
    {label: 'مدعوم', value: 'supported'},
    {label: 'غير مدعوم', value: 'not_supported'}
  ];

  selectedSupport: string = 'all';

  filterBySupport(event: any) {
    const value = event.value;
    if (value === 'all') {
      this.dataSource.data = this.originalData;
    } else if (value === 'supported') {
      this.dataSource.data = this.originalData.filter(w => w.is_supported === 1);
    } else if (value === 'not_supported') {
      this.dataSource.data = this.originalData.filter(w => w.is_supported === 0);
    }
    this.dataSource.paginator = this.paginator;
  }

  editWidow(widow: any) {
    const dialogRef = this.dialog.open(EditWidowDialogComponent, {
      width: '400px',
      data: {...widow}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.widowService.updateWidow(result.id, result);
          await this.loadWidows();
        } catch (error) {
          console.error('Failed to update widow:', error);
          alert('فشل في تحديث بيانات الأرملة.');
        }
      }
    });
  }

  // deleteWidow with confirmation
  deleteWidow(widow: any) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذه الأرملة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'لا',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'نعم',
        severity: 'danger',
      },
      accept: () => {
        // Call delete function here
        this.widowService.deleteWidow(widow.id).then(() => {
          // If delete successful, reload widows
          this.loadWidows();
          alert('تم الحذف بنجاح');
        }).catch(error => {
          console.error('Failed to delete widow:', error);
          alert('فشل في حذف الأرملة.');
        });
      },
      reject: () => {
        console.log('Deletion canceled');
      }
    });
  }

  getExportButtonColor(): 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | null {
    switch (this.selectedSupport) {
      case 'supported':
        return 'success'; // green
      case 'not_supported':
        return 'danger'; // red
      case 'all':
      default:
        return 'info'; // blue
    }
  }

}
