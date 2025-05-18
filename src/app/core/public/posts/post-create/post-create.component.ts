import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryService} from '../../../services/service/CategoryService';
import {PostService} from '../../../services/service/PostService';
import {NgxEditorModule} from 'ngx-editor';
import {SafeUrlPipe} from '../../user/pipe/SafeUrlPipe';
import { EditorModule } from 'primeng/editor';
import {NgxSpinnerService} from 'ngx-spinner';
@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule, SafeUrlPipe, EditorModule],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm!: FormGroup;
  categoryService = new CategoryService()
  postService = new PostService()
  private spinner = inject(NgxSpinnerService);

  categories: any[] = [];
  selectedImages: File[] = [];
  post: any;
  html = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', Validators.required],
      category: ['', Validators.required],
    });
    this.postService.findPostById(5).then(resp => {
      this.post = resp.data
    })
    this.fetchCategories();
  }



  fetchCategories() {
    this.categoryService.getAll().then((data) => {
      this.categories = data.data;
    }).finally(() => {
      this.spinner.hide(); // Ensure hide is always called
    });
  }


  onFilesSelected(event: any) {
    if (event.target.files) {
      const files = Array.from(event.target.files) as File[];
      this.selectedImages.push(...files);
    }
  }

  removeNewImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('content', this.postForm.value.content);
    formData.append('category_id', this.postForm.value.category);

    this.selectedImages.forEach((file) => {
      formData.append('images[]', file);
    });
    this.postService.createPost(formData).then(resp => {
      console.log('post succes added')
      this.postForm.reset()
    })
  }

}
