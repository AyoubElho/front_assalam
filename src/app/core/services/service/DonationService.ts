import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/donations`;

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private router?: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Method to get all donations
  public getAll() {
    return axios.get(`${API_BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Method to get the total amount of donations
  public getTotalAmount() {
    return axios.get(`${API_BASE_URL}/count`, {
      headers: this.getAuthHeaders(),
    });
  }
}
