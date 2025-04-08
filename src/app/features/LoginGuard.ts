import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {

    const token = localStorage.getItem('jwt');
    if (token) {
      this.router.navigate(['/'])
      return false
    }
    return true;
  }
}
