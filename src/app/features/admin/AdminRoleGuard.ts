import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AdminRoleGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (token && role === 'admin') {
      return true;
    }
    this.router.navigate(['/not-found']); // Redirect to 404 page
    return false;
  }
}
