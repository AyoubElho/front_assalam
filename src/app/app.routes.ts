import {Routes} from '@angular/router';

// Admin Pages
import {LoginComponent} from './features/admin/pages/auth/login/login.component';
import {HomeComponent} from './features/admin/pages/dashboard/home/home.component';
import {OrphanesComponent} from './features/admin/pages/dashboard/orphan/orphanes/orphanes.component';
import {OrphanCreateComponent} from './features/admin/pages/dashboard/orphan/orphan-create/orphan-create.component';
import {OrphanDetaillComponent} from './features/admin/pages/dashboard/orphan/orphan-detaill/orphan-detaill.component';

// Layout
import {DashboardLayoutComponent} from './layouts/dashboard-layout/dashboard-layout.component';

// Guards
import {AdminRoleGuard} from './features/admin/AdminRoleGuard';

// User and Misc
import {UserComponent} from './features/user/user.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {UserLayoutComponent} from './layouts/user-layout/user-layout.component';
import {LoginGuard} from './features/LoginGuard';
import {GuardiansComponent} from './features/admin/pages/dashboard/guardians/guardians.component';

export const routes: Routes = [

  // Login Route (public)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },

  // Admin Routes
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [AdminRoleGuard],
    children: [
      {path: 'dashboard', component: HomeComponent},
      {path: 'orphans', component: OrphanesComponent},
      {path: 'orphan/create', component: OrphanCreateComponent},
      {path: 'orphan/:id', component: OrphanDetaillComponent},
      {path: 'guardians', component: GuardiansComponent},
    ]
  },

  // Public User Route
  {
    path: '',
    component: UserLayoutComponent,
  },

  {
    path: 'not-found',
    component: NotFoundComponent

  },

// Not Found
  {
    path: '**',
    component: NotFoundComponent
  }
];
