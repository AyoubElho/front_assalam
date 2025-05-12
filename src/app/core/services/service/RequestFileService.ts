import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/requests`;

@Injectable({
  providedIn: 'root',
})
export class RequestFileService {

  constructor(private router?: Router) {
  }

  // ✅ Centralized token header getter
  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Update request file status
  public updateStatus(fileId: number, status: string) {
    return axios.post(`${API_BASE_URL}/files/${fileId}/status/${status}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Reupload a file
  public reuploadFile(fileId: number, fileData: any) {
    const formData = new FormData();
    formData.append('file_path', fileData.file); // must be actual File object
    formData.append('file_type', fileData.file_type); // matching one of Laravel's accepted values

    return axios.post(`${API_BASE_URL}/reupload/${fileId}`, formData, {
      headers: {
        ...this.getAuthHeaders(),
        // No need to manually set Content-Type — axios will handle it when using FormData
      },
    });
  }

  public addNote(fileId: number, note: string) {
    return axios.post(`${API_BASE_URL}/file/${fileId}/add/note/${note}`, {},{
      headers: this.getAuthHeaders(),
    });
  }


}
