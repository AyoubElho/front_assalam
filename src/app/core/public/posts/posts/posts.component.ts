import {Component, inject, OnInit} from '@angular/core';
import {PostService} from '../../../services/service/PostService';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CategoryService} from '../../../services/service/CategoryService';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  imports: [
    FormsModule,
    SlicePipe,
    NgForOf,
    NgIf,
    RouterLink,
    DatePipe,
    NgClass
  ],
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  postService = new PostService();
  categoryService = inject(CategoryService);
  categories: any = [];
  posts: any = [];
  searchText: string = "";

  // Pagination variables
  currentPage: number = 1;
  lastPage: number = 1;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;
  selectedCategory: string | null = null;

  ngOnInit() {
    this.loadAllCategories();
    this.loadAllPosts();
  }

  // Load posts by category, with pagination support
  loadPostsByCategory(categoryName: string, page: number = 1) {
    this.selectedCategory = categoryName; // Set the selected category
    this.postService.getPostsByCategory(categoryName, page).then(resp => {
      this.posts = resp.data.data;
      this.currentPage = resp.data.current_page;
      this.lastPage = resp.data.last_page;
      this.nextPageUrl = resp.data.next_page_url;
      this.prevPageUrl = resp.data.prev_page_url;
    });
  }

  // Load all posts (optional if you want to include an "All" button)
  loadAllPosts(page: number = 1) {
    this.selectedCategory = ""; // Clear category filter
    this.postService.getAll(page).then(resp => {
      this.posts = resp.data.data;
      this.currentPage = resp.data.current_page;
      this.lastPage = resp.data.last_page;
      this.nextPageUrl = resp.data.next_page_url;
      this.prevPageUrl = resp.data.prev_page_url;
    });
  }

  loadAllCategories() {
    this.categoryService.getAll().then(resp => {
      this.categories = resp.data;
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.selectedCategory ? this.loadPostsByCategory(this.selectedCategory, page) : this.loadAllPosts(page);
      this.currentPage = page;
      this.scrollToTop();
    }
  }

  goToNextPage() {
    if (this.nextPageUrl) {
      this.currentPage++;
      this.selectedCategory ? this.loadPostsByCategory(this.selectedCategory, this.currentPage) : this.loadAllPosts(this.currentPage);
    }
  }

  goToPreviousPage() {
    if (this.prevPageUrl) {
      this.currentPage--;
      this.selectedCategory ? this.loadPostsByCategory(this.selectedCategory, this.currentPage) : this.loadAllPosts(this.currentPage);
    }
  }

  formatImage(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return ``;
  }

  protected readonly environment = environment;
}
