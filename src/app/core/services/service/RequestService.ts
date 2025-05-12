import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/requests`;

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private router?: Router) {
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Get all requests
  public getAllRequests() {
    return axios.get(`${API_BASE_URL}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Count requests by status
  public countByStatus(status: string) {
    return axios.get(`${API_BASE_URL}/count/status/${status}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Create a new request
  public createRequest(formData: FormData) {
    return axios.post(`${API_BASE_URL}/create`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Update request status
  public updateStatus(idRequest: number, status: string) {
    return axios.put(`${API_BASE_URL}/${idRequest}/status/${status}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Find request by ID
  public findById(id: number) {
    return axios.get(`${API_BASE_URL}/find/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
