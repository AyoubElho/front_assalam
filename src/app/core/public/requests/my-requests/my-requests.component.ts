import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/service/AuthService';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import axios from 'axios';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-my-requests',
  imports: [
    NgClass,
    NgForOf,
    DatePipe,
    NgIf,
    MatIconModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.css'
})
export class MyRequestsComponent implements OnInit {

  authService = new AuthService()
  myRequests: any = []

  constructor(private router: Router) {
  }

  ngOnInit(): void {

    this.authService.user().then(resp => {
      this.myRequests = resp.data
      console.log(resp.data)
    })
  }

  openedAccordionId: number | null = null;


  onFileSelected(event: any, requestId: number, fileId: number) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // 👇 Send it to the server, attach requestId + fileId for backend mapping
      console.log("Uploading file for Request:", requestId, "File ID:", fileId, selectedFile);

      // Optionally — use FormData for upload
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('file_id', fileId.toString());
      // formData.append('request_id', requestId.toString());
      // this.http.post('/your-upload-endpoint', formData).subscribe(...)
    }
  }


  handleStatusClick(request: any) {
    if (request.status === 'قيد_المراجعة') {
      this.router.navigate(['/review-issue', request.id]);
    }
  }

  sentToDetaill(id: any) {
    this.router.navigate(['my-requests/detail/', id])
  }

  onDownloadFile(id: number) {
    const token = localStorage.getItem('jwt'); // or sessionStorage or from your AuthService
    axios.get(`${environment.apiURL}/api/requests/summary/${id}`, {
      responseType: 'blob', // Important for binary (PDF) files
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `طلب-${id}.pdf`;
      link.click();
    }).catch(error => {
      console.error("Download error:", error);
    });
  }

}
