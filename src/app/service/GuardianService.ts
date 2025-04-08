import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

const API_URL = "http://localhost:8000/api/guardians";

@Injectable({
  providedIn: 'root',
})

export class GuardianService {

  constructor(private router?: Router) {
  }

  public getAll() {

    const token = localStorage.getItem('jwt');

    return axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

}
