import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { error } from '@angular/compiler/src/util';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string; // 116

  constructor(public authService: AuthService, private alertify: AlertifyService,
       private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl); // 116
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');
    // tslint:disable-next-line:no-shadowed-variable
    }, error => {
       this.alertify.error(error); //  'Failed to loginsss');
    }, () => {
      this.router.navigate(['/members']);
    }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token;
  }

  logout() {
    // remove the variables in the localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 114
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }
}
