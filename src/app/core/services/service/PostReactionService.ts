import axios from 'axios';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {env} from 'ckeditor5';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/posts`;

@Injectable({
  providedIn: 'root',
})
export class PostReactionService {

  constructor(private router?: Router) {
  }

  // ✅ Centralized token header generator
  private getAuthHeaders() {
    const token = localStorage.getItem('jwt');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ React to a post (like or dislike)
  public reactToPost(postId: number, reaction: string) {
    return axios.post(`${API_BASE_URL}/${postId}/react`, {reaction}, {
        headers: this.getAuthHeaders(),
      }
    )
      ;
  }

  // ✅ Remove reaction (like or dislike)
  public removeReaction(postId: number) {
    return axios.delete(`${API_BASE_URL}/${postId}/destroy`, {
      headers: this.getAuthHeaders(),
    });
  }

  public reactionUser(postId: number) {
    return axios.get(`${API_BASE_URL}/${postId}/user`, {
      headers: this.getAuthHeaders(),
    });
  }

  public likeDislikeCounts(postId: number) {
    return axios.get(`${API_BASE_URL}/${postId}/reactions`)
  }
}
