import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/events`;

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private router?: Router) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public create(event: any) {
    return axios.post(`${API_BASE_URL}/create`, event, {
      headers: this.getAuthHeaders(),
    });
  }

  public getAll() {
    return axios.get(`${API_BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  public update(eventId: number, updatedEvent: any) {
    return axios.put(`${API_BASE_URL}/${eventId}`, updatedEvent, {
      headers: this.getAuthHeaders(),
    });
  }

  public delete(eventId: number) {
    return axios.delete(`${API_BASE_URL}/${eventId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
