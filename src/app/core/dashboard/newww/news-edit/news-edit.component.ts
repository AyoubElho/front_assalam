import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/service/CategoryService';
import { PostService } from '../../../services/service/PostService';
import {NgForOf, NgIf} from '@angular/common';
import {SafeUrlPipe} from '../../../public/user/pipe/SafeUrlPipe';
import {EditorModule} from "primeng/editor";
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.css'],
    imports: [
        NgForOf,
        SafeUrlPipe,
        ReactiveFormsModule,
        NgIf,
        EditorModule
    ]
})
export class NewsEditComponent implements OnInit {
  postForm!: FormGroup;
  categories: any[] = [];
  selectedImages: File[] = [];
  removedImages: number[] = [];
  existingImages: any[] = [];
  post: any;
  postId: number | undefined;
  html = '';
  isSubmitting: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.postId = +this.route.snapshot.paramMap.get('id')!;

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', Validators.required],
      category: ['', Validators.required],
    });

    this.postService.findPostById(this.postId).then((resp) => {
      this.post = resp.data;
      this.existingImages = this.post.images;

      this.postForm.patchValue({
        title: this.post.title,
        content: this.post.content,
        category: this.post.category_id,
      });
    });

    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getAll().then((data) => {
      this.categories = data.data;
    });
  }

  onFilesSelected(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.selectedImages.push(...files);
    }
  }

  removeExistingImage(imageId: number) {
    this.removedImages.push(imageId);
    this.existingImages = this.existingImages.filter(img => img.id !== imageId);
  }

  removeNewImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('content', this.postForm.value.content);
    formData.append('category_id', this.postForm.value.category);

    this.removedImages.forEach(id => {
      formData.append('removed_images[]', id.toString());
    });

    this.selectedImages.forEach(file => {
      formData.append('images[]', file);
    });

    if (this.postId) {
      this.postService.updatePost(this.postId, formData).then(() => {
        console.log('Post updated');
      });
    }
  }

  protected readonly environment = environment;
}
