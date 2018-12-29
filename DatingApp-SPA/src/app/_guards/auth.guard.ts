import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/Auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // create a constructor ..
  constructor(private authService: AuthService, private router: Router,
    private  alertify: AlertifyService) {}


  canActivate (): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }
    // user is not logged in
    this.alertify.error('You shal not pass..');
    this.router.navigate(['/home']);
    return false;
  }
}
