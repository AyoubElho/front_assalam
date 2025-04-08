import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

const API_URL = "http://localhost:8000/api/login";

@Injectable({
  providedIn: 'root',  // Makes it available app-wide
})

export class AuthService {


  public login(email: string, password: string) {
    return axios.post(API_URL, {email, password});
  }

  constructor(private router: Router) {
  }


  public user() {
    const token = localStorage.getItem('jwt');  // Retrieve token from localStorage

    if (token) {
      // Send token as Authorization header
      return axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    } else {
      return Promise.reject('No token found');
    }
  }

  logout(): void {
    // Get the token from localStorage or wherever you store it
    const token = localStorage.getItem('jwt'); // Replace with your token storage logic7
    const role = localStorage.getItem('role'); // Replace with your token storage logic7
    if (token) {
      axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`  // Send the token in the Authorization header
        }
      })
        .then(response => {
          if (role === 'admin') {
            this.router.navigate(['/']);
            localStorage.removeItem('jwt');
            localStorage.removeItem('role');
          } else {
            localStorage.removeItem('jwt');
            localStorage.removeItem('role');
          }


        })
        .catch(error => {
          console.error('Error logging out:', error);
        });
    } else {
      console.error('No authentication token found.');
    }
  }
}
