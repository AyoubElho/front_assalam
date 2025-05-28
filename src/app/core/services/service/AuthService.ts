import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router?: Router) {
  }

  public register(userData: any) {
    return axios.post(`${API_BASE_URL}/register`, userData);
  }


  // ✅ Login method
  public login(email: string, password: string) {
    return axios.post(`${API_BASE_URL}/login`, {email, password});
  }

  // ✅ Get token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }

  public getAll(){
    const token = this.getAuthToken();

    if (token) {
      return axios.get(`${API_BASE_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }


  // ✅ Get user info (secured)
  public user() {
    const token = this.getAuthToken();

    if (token) {
      return axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }

  // ✅ Logout method
  public logout(): void {
    const token = this.getAuthToken();
    const role = localStorage.getItem('role');

    if (token) {
      axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          // Clear token and role
          localStorage.removeItem('jwt');
          localStorage.removeItem('role');
          this.router?.navigate(['/']);
        })
        .catch(error => {
          console.error('Error logging out:', error);
        });

    } else {
      console.error('No authentication token found.');
    }
  }


  public resetUserPassword(userId: number, newPassword: string, confirmPassword: string) {
    const token = this.getAuthToken();

    if (token) {
      return axios.post(`${API_BASE_URL}/users/${userId}/reset-password`, {
        password: newPassword,
        password_confirmation: confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }

  public deleteUser(userId: number) {
    const token = this.getAuthToken();

    if (token) {
      return axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }

  public modifyUserRole(userId: number, newRole: string) {
    const token = this.getAuthToken();

    if (token) {
      return axios.put(`${API_BASE_URL}/users/${userId}/role`, {
        role: newRole
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }


  public updateProfile(formData: FormData) {
    const token = this.getAuthToken();

    if (token) {
      return axios.post(`${API_BASE_URL}/users/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return Promise.reject('No token found');
    }
  }


}
