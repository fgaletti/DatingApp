import { Component, OnInit } from '@angular/core';
import {AuthService} from './_services/Auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from './_models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  jwtHelper = new JwtHelperService();

   constructor(private authService: AuthService) {}

   ngOnInit() {
    // LOAD VALUES FROM LOCALSTORAGE
    const token = localStorage.getItem('token');
    // JSON.parse
    const user: User = JSON.parse(localStorage.getItem('user'));

    // pass the token to authService, this variable is going to used thoughout the website
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    console.log('antes user') ;
    if (user) {
      this.authService.currentUser = user;
      // 116 update photo with the photo stored in our database
      this.authService.changeMemberPhoto(user.photoUrl);
      console.log(this.authService.currentUser.photoUrl);
    }

   }

}
