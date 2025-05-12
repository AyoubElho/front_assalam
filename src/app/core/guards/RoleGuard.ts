import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    const expectedRoles = route.data['expectedRoles'] as Array<string>;

    // If no token, redirect to login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // If no expected roles specified, allow access to any authenticated user
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // Check if user has one of the expected roles
    if (role && expectedRoles.includes(role)) {
      return true;
    }

    // Special case for super admin (can access admin routes)
    if (role === 'super-admin' && expectedRoles.some(r => r === 'admin')) {
      return true;
    }

    // Redirect to not-authorized if user is authenticated but doesn't have required role
    if (token) {
      this.router.navigate(['/not-authorized']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
