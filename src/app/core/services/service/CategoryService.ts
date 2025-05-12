import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private router?: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Get all categories
  public getAll() {
    return axios.get(`${API_BASE_URL}/categories`, {
      headers: this.getAuthHeaders(),
    });
  }

  // category.service.ts
  public createCategory(name: string) {
    return axios.post(`${API_BASE_URL}/categories/create`, { name }, {
      headers: this.getAuthHeaders(),
    });
  }


}
