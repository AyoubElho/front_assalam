import {Routes} from '@angular/router';

// Admin Pages
import {LoginComponent} from './core/public/auth/login/login.component';
import {HomeComponent} from './core/dashboard/home/home.component';
import {OrphanesComponent} from './core/dashboard/orphan/orphanes/orphanes.component';
import {OrphanCreateComponent} from './core/dashboard/orphan/orphan-create/orphan-create.component';

// Layout
import {DashboardLayoutComponent} from './core/layouts/dashboard-layout/dashboard-layout.component';

// Guards
import {RoleGuard} from './core/guards/RoleGuard';

// User and Misc
import {UserComponent} from './core/public/user/user.component';
import {NotFoundComponent} from './core/shared/components/not-found/not-found.component';
import {UserLayoutComponent} from './core/layouts/user-layout/user-layout.component';
import {LoginGuard} from './core/guards/LoginGuard';
import {ApplicationSubmissionComponent} from './core/public/application-submission/application-submission.component';
import {RequestReviewComponent} from './core/dashboard/request/request-review/request-review.component';
import {RequestDetaillComponent} from './core/dashboard/request/request-detaill/request-detaill.component';
import {MyRequestsComponent} from './core/public/requests/my-requests/my-requests.component';
import {MyRequestDetailComponent} from './core/public/requests/my-request-detail/my-request-detail.component';
import {WidowsComponent} from './core/dashboard/widow/widows/widows.component';
import {WindowCreateComponent} from './core/dashboard/widow/window-create/window-create.component';
import {PostCreateComponent} from './core/public/posts/post-create/post-create.component';
import {PostsComponent} from './core/public/posts/posts/posts.component';
import {PostDetaillComponent} from './core/public/posts/post-detaill/post-detaill.component';
import {PaymentSuccessComponent} from './core/payment/payment-success/payment-success.component';
import {PaymentCancelComponent} from './core/payment/payment-cancel/payment-cancel.component';
import {RegisterComponent} from './core/public/auth/register/register.component';
import {ProfileComponent} from './core/public/profile/profile.component';
import {DistitutesComponent} from './core/dashboard/distitute/distitutes/distitutes.component';
import {CalendarComponent} from './core/dashboard/calendar/calendar.component';
import {AdminsComponent} from './core/dashboard/admin/admins/admins.component';
import {DistiuteCreateComponent} from './core/dashboard/distitute/distiute-create/distiute-create.component';
import {NewsComponent} from './core/dashboard/newww/news/news.component';
import {NewsEditComponent} from './core/dashboard/newww/news-edit/news-edit.component';
import {VerifyComponent} from './core/dashboard/request/verify/verify.component';

export const routes: Routes = [


  {
    path: 'verify/:code',
    component: VerifyComponent,
    canActivate: [RoleGuard],
    data: { expectedRoles: ['admin','super_admin'] },
  },

// Login Route (public)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  // Admin Routes
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,  // Default layout for Admin
    canActivate: [RoleGuard],  // Guard checks the role dynamically
    children: [
      {path: '', component: HomeComponent},
      {path: 'orphans', component: OrphanesComponent},
      {path: 'orphan/create', component: OrphanCreateComponent},
      {path: 'requests', component: RequestReviewComponent},
      {path: 'request/detaill/:id', component: RequestDetaillComponent},
      {path: 'widows', component: WidowsComponent},
      {path: 'widow/create', component: WindowCreateComponent},
      {path: 'distitutes', component: DistitutesComponent},
      {path: 'distitute/create', component: DistiuteCreateComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'admins', component: AdminsComponent},
      {path: 'news', component: NewsComponent},
      {path: 'news/edit/:id', component: NewsEditComponent},
      {path: 'post/create', component: PostCreateComponent},

    ]
  },


  // Public User Route
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {path: '', component: UserComponent},
      {path: 'request', component: ApplicationSubmissionComponent},
      {path: 'my-requests', component: MyRequestsComponent},
      {path: 'my-requests/detail/:id', component: MyRequestDetailComponent},
      {path: 'post/detail/:id', component: PostDetaillComponent},
      {path: 'posts', component: PostsComponent},
      {path: 'profile', component: ProfileComponent},


    ]
  },

  {
    path: 'not-found',
    component: NotFoundComponent

  },
  {path: 'payment-success', component: PaymentSuccessComponent},
  {path: 'payment-cancel', component: PaymentCancelComponent},

// Not Found
  {
    path: '**',
    component: NotFoundComponent
  }
];
