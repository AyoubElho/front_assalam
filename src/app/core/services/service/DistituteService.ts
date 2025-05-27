import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/destitutes`;

@Injectable({
  providedIn: 'root',
})
export class DistituteService {
  constructor(private router?: Router) {
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public create(destituteData: any) {
    return axios.post(`${API_BASE_URL}/create`, destituteData, {
      headers: this.getAuthHeaders()
    });
  }

  public getAll() {
    return axios.get(`${API_BASE_URL}/`, {
      headers: this.getAuthHeaders()
    });
  }


  public update(id: number, destituteData: any) {
    return axios.post(`${API_BASE_URL}/update/${id}`, destituteData, {
      headers: this.getAuthHeaders()
    });
  }

  public delete(id: number) {
    return axios.delete(`${API_BASE_URL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  public checkCinExists(cin: string) {
    return axios.get(`${API_BASE_URL}/check-cin/${cin}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
