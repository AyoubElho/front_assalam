import axios from "axios";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';

const API_BASE_URL = `${environment.apiURL}/api/posts`;

@Injectable({
  providedIn: 'root',
})
export class PostService {

  constructor(private router?: Router) {}

  // ✅ Get posts by category (public)
  public getPostsByCategory(name: string, page: number = 1) {
    return axios.get(`${API_BASE_URL}/find/posts/category/${name}?page=${page}`);
  }

  // ✅ Get all posts
  public getAll(page: number = 1) {
    return axios.get(`${API_BASE_URL}?page=${page}`);
  }

  // ✅ Find a post by ID
  public findPostById(id: number) {
    return axios.get(`${API_BASE_URL}/find/` + id);
  }

  // ✅ Create a post
  public createPost(data: any) {
    const token = localStorage.getItem('jwt');
    return axios.post(`${API_BASE_URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  // ✅ Update a post
  public updatePost(id: number, data: FormData) {
    const token = localStorage.getItem('jwt');
    return axios.post(`${API_BASE_URL}/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  // ✅ Delete a post
  public deletePost(id: number) {
    const token = localStorage.getItem('jwt');
    return axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
}
