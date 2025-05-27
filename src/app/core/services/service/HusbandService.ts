import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/husbands`;

@Injectable({
  providedIn: 'root',
})
export class HusbandService {
  constructor(private router?: Router) {
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public checkCinExists(cin: string) {
    return axios.get(`${API_BASE_URL}/check-cin/${cin}`, {
      headers: this.getAuthHeaders(),
    });
  }

}
