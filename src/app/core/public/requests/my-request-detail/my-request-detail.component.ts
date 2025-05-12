import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestService} from '../../../services/service/RequestService';
import {JsonPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {RequestFileService} from '../../../services/service/RequestFileService';
import {Location} from '@angular/common';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-my-request-detail',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf],
  templateUrl: './my-request-detail.component.html',
  styleUrl: './my-request-detail.component.css'
})
export class MyRequestDetailComponent implements OnInit {
  requestId!: number;
  requestService = new RequestService();
  requestFileService = new RequestFileService();
  request: any;

  // Store selected files
  pendingUploads: { [fileId: number]: { file: File, file_type: string } } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.requestService.findById(this.requestId).then(resp => {
      this.request = resp.data;
    });
  }

  onFileSelect(event: any, file: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.pendingUploads[file.id] = {
        file: selectedFile,
        file_type: file.file_type
      };
      file.newFileUploaded = true;
    } else {
      // User canceled the file picker dialog
      delete this.pendingUploads[file.id];
      file.newFileUploaded = false;
    }
  }

  isAllReuploadsReady(): boolean {
    if (!this.request?.request_files) return false;

    // Check if there is any file with 'rejected' status
    const rejectedFiles = this.request.request_files.filter((file: any) => file.status === 'rejected');

    // If no files are rejected, return false to disable the button
    if (rejectedFiles.length === 0) {
      return false;
    }

    // Check if all rejected files are uploaded
    return rejectedFiles.every((file: any) => !!this.pendingUploads[file.id]);
  }

  hasRejectedFile(): boolean {
    // Check if any file has the status 'rejected'
    return this.request['request_files'].some((file: any) => file.status === 'rejected');
  }


  submitAllReuploads() {
    for (const fileId in this.pendingUploads) {
      this.requestFileService.reuploadFile(+fileId, this.pendingUploads[fileId])
        .then(() => {
          console.log(`File ${fileId} uploaded successfully`);
          this.router.navigate(['my-requests/'])
        })
        .catch((err) => {
          console.error(`Error uploading file ${fileId}`, err);
        });
    }
  }

  protected readonly Object = Object;
  protected readonly environment = environment;
}
