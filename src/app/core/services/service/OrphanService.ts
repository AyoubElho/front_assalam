import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Orphan } from '../../models/Orphan';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/orphans`;

@Injectable({
  providedIn: 'root',
})
export class OrphanService {

  constructor(private router?: Router) {}

  // ✅ Centralized token header generator
  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Create an orphan
  public create(orphan: Orphan) {
    return axios.post(`${API_BASE_URL}/orphan/create`, orphan, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Get all orphans
  public getAll() {
    return axios.get(`${API_BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Find orphan by ID
  public findById(id: number) {
    return axios.get(`${API_BASE_URL}/findId/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Delete orphan by ID
  public deleteById(id: number) {
    return axios.delete(`${API_BASE_URL}/orphan/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Count orphans
  public count() {
    return axios.get(`${API_BASE_URL}/count/`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Update is_studying status of an orphan
  public updateIsStudyingStatus(id: number, is_studying: number) {
    return axios.put(
      `${API_BASE_URL}/${id}/update-studying`,
      { is_studying },
      { headers: this.getAuthHeaders() }
    );
  }

}
