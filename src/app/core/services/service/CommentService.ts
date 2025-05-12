import axios from "axios";
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/comments`;

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private router?: Router) {
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public create(comment: any) {
    return axios.post(`${API_BASE_URL}/create`, comment, {
        headers: this.getAuthHeaders()
      }
    );
  }

// CommentService
  public getAll(postId: number, page: number = 1) {
    return axios.get(`${API_BASE_URL}/${postId}?page=${page}`);
  }

  public delete(commentId: number) {
    return axios.delete(`${API_BASE_URL}/comment/id/${commentId}`, {
      headers: this.getAuthHeaders()
    });
  }

}
