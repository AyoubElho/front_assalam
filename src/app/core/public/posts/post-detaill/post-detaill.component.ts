import {PostService} from '../../../services/service/PostService';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {GalleriaModule} from 'primeng/galleria';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PostReactionService} from '../../../services/service/PostReactionService';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../services/service/AuthService';
import {Dialog} from 'primeng/dialog';
import {CommentService} from '../../../services/service/CommentService';
import {NgxSpinnerService} from "ngx-spinner";
import {comment} from 'postcss';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Toast} from 'primeng/toast';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-post-detaill',
  standalone: true,
  imports: [
    FormsModule,
    GalleriaModule,
    MatIcon,
    MatButton,
    Dialog,
    ConfirmDialog,
    Toast,
  ],
  templateUrl: './post-detaill.component.html',
  styleUrls: ['./post-detaill.component.css']
})
export class PostDetaillComponent implements OnInit {
  post: any;
  reactUser: string = ''
  likeCount = 0;
  dislikeCount: number = 0;
  userAuthId: number = 0
  isLoading: boolean = true;
  imageDialogVisible: boolean = false;
  selectedImagePath: string = '';
  newComment: any;
  comments: any = []
  liked = false;
  disliked = false;

  currentPage: number = 1;
  lastPage: number = 1;
  paginatedComments: any[] = [];


  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private authUser: AuthService,
    private commentService: CommentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private postService: PostService,
    private postReactionService: PostReactionService,
    private spinner: NgxSpinnerService
  ) {
  }


  responsiveOptions: any[] = [
    {
      breakpoint: '991px',
      numVisible: 4
    },
    {
      breakpoint: '767px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  ngOnInit(): void {
    this.spinner.show();
    const id: number = Number(this.route.snapshot.paramMap.get('id'));

    // First get auth user
    this.authUser.user().then(res => {
      this.userAuthId = Number(res.data.id)
    }).catch(err => {
      console.error('Auth error:', err);
    });

    this.commentService.getAll(id).then(resp => {
      this.comments = resp.data.data
    })

    // Then get post details
    this.postService.findPostById(id).then(resp => {
      this.post = resp.data;
      this.loadComments(1);

      const promises = [
        // Like/dislike counts
        this.postReactionService.likeDislikeCounts(this.post.id).then(res => {
          this.likeCount = res.data.likes;
          this.dislikeCount = res.data.dislikes;
        }),

        // User's reaction
        this.postReactionService.reactionUser(this.post.id).then(resp => {
          this.reactUser = resp.data.data;
          this.liked = this.reactUser === 'like';
          this.disliked = this.reactUser === 'dislike';
        })
      ];

      // Wait for all nested promises to finish before hiding spinner
      Promise.all(promises)
        .then(() => {
        })
        .catch(err => {
          console.error('Error loading reactions:', err);
        })
        .finally(() => {
          this.spinner.hide();
          this.isLoading = false;
        });


    }).catch(err => {
      console.error('Error loading post:', err);
      this.spinner.hide();
      this.isLoading = false;
    });
  }


  showDeletePost(userId: number):
    boolean {
    return this.userAuthId == userId
  }

  loadComments(page: number = 1) {
    const postId = this.post.id;
    this.commentService.getAll(postId, page).then(resp => {
      this.paginatedComments = resp.data.data;
      this.currentPage = resp.data.current_page;
      this.lastPage = resp.data.last_page;
    }).catch(err => {
      console.error('Error loading paginated comments:', err);
    });
  }


  likePost(idPost: number) {
    if (localStorage.getItem('jwt')) {
      if (this.liked) {
        this.postReactionService.removeReaction(idPost).then(res => {
          console.log('succés dislike like')
        })
        this.liked = false;
      } else {
        this.postReactionService.reactToPost(idPost, 'like').then(res => {
          console.log('succés added like')
        })
        this.liked = true;
        if (this.disliked) {
          this.disliked = false;
        }
      }
    } else {
      this.router.navigate(['/login'])
    }

  }

  dislikePost(idPost: number) {
    if (localStorage.getItem('jwt')) {
      if (this.disliked) {
        this.postReactionService.removeReaction(idPost).then(res => {
          console.log('succés remove dislike')
        })
        this.disliked = false
      } else {
        this.postReactionService.reactToPost(idPost, 'dislike').then(res => {
          console.log('succés added dislike')
        })
        this.disliked = true
        if (this.liked) {
          this.liked = false;
        }
      }
    } else {
      this.router.navigate(['/login'])
    }
  }


  sharePost(): void {
    const postUrl = `${window.location.origin}/post/detaill/${this.post.id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      this.snackBar.open('Link copied to clipboard!', 'Close', {duration: 3000});
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  }

  submitComment(postId: number) {
    if (this.newComment.trim() && postId) {
      let comment = {
        post_id: postId,
        comment: this.newComment
      };

      // Add the new comment first locally (optional, for immediate UI feedback)
      this.commentService.create(comment).then(resp => {
        console.log('added successfully');
        // After comment is added, reload the comments for this post
        this.postService.findPostById(postId).then(resp => {
          this.post = resp.data;
          this.newComment = '';
          this.loadComments(1);

        }).catch(err => {
          console.error('Error reloading comments:', err);
        });
      }).catch(err => {
        console.error('Error adding comment:', err);
      });
    }
  }

  deleteComment(id: number) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذا التعليق؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      acceptButtonStyleClass: 'p-button-danger', // This makes the button red
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.commentService.delete(id).then(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حذف التعليق بنجاح'
          });
          this.loadComments(this.currentPage);

        });
      },
      reject: () => {

      }
    });
  }


  protected readonly environment = environment;
}
