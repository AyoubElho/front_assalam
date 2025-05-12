import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {PostService} from '../../../services/service/PostService';
import {CreateCategoryDialogComponent} from '../dashboard/news/create-category-dialog/create-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {StripHtmlPipe} from './StripHtmlPipe';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-news',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink,
    SlicePipe,
    NgClass,
    MatIconModule,
    StripHtmlPipe
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  postService = new PostService();
  posts: any = [];
  searchText: string = "";

  // Pagination variables
  currentPage: number = 1;
  lastPage: number = 1;
  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  constructor(private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadAllPosts();
  }

  loadAllPosts(page: number = 1) {
    this.postService.getAll(page).then(resp => {
      this.posts = resp.data.data;
      this.currentPage = resp.data.current_page;
      this.lastPage = resp.data.last_page;
      this.nextPageUrl = resp.data.next_page_url;
      this.prevPageUrl = resp.data.prev_page_url;
    });
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.loadAllPosts(page);
      this.currentPage = page;
      this.scrollToTop();

    }
  }

  goToNextPage() {
    if (this.nextPageUrl) {
      this.currentPage++;
      this.loadAllPosts(this.currentPage);
    }
  }

  goToPreviousPage() {
    if (this.prevPageUrl) {
      this.currentPage--;
      this.loadAllPosts(this.currentPage);
    }
  }

  onDeletePost(id: any) {
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (confirmed) {
      this.postService.deletePost(id)
        .then(() => {
          alert("Article supprimé avec succès !");
          this.loadAllPosts(this.currentPage);
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Échec de la suppression. Veuillez réessayer.");
        });
    }
  }

  openCreateCategoryDialog() {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert('تمت إضافة الفئة بنجاح');
      }
    });
  }

  onEditPost(id: any) {
    this.router.navigate(['/dashboard/news/edit', id]);
  }

  protected readonly environment = environment;
}
