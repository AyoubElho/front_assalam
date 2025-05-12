import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/widows`;

@Injectable({
  providedIn: 'root',
})
export class WidowService {
  constructor(private router?: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public getAllWidows() {
    return axios.get(`${API_BASE_URL}`, {
      headers: this.getAuthHeaders(),
    });
  }

  public count() {
    return axios.get(`${API_BASE_URL}/count`, {
      headers: this.getAuthHeaders(),
    });
  }

  public createWidow(widowData: any) {
    return axios.post(`${API_BASE_URL}/create`, widowData, {
      headers: this.getAuthHeaders()
    });
  }

  public updateWidow(id: number, widowData: any) {
    return axios.put(`${API_BASE_URL}/${id}`, widowData, {
      headers: this.getAuthHeaders()
    });
  }

  // New deleteWidow function
  public deleteWidow(id: number) {
    return axios.delete(`${API_BASE_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
