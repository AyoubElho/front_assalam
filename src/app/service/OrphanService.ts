import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Orphan} from './Orphan';

const API_URL = "http://localhost:8000/api/orphans";

@Injectable({
  providedIn: 'root',
})

export class OrphanService {

  constructor(private router?: Router) {
  }

  public create(orphan: Orphan) {

    const token = localStorage.getItem('jwt');

    return axios.post("http://localhost:8000/api/orphan/create", orphan, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  public getAll() {

    const token = localStorage.getItem('jwt');  // Retrieve token from localStorage

    return axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  public findById(id: number) {

    const token = localStorage.getItem('jwt');  // Retrieve token from localStorage

    return axios.get("http://localhost:8000/api/findId/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  public count() {

    const token = localStorage.getItem('jwt');  // Retrieve token from localStorage

    return axios.get("http://localhost:8000/api/count/", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }


}
