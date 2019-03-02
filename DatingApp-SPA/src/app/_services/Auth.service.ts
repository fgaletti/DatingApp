import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs'; // 116 cap
import { map } from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 baseUrl =  environment.apiUrl +  'Auth/';
 jwtHelper = new JwtHelperService();
 decodedToken: any;
 currentUser: User; // 114
 photoUrl = new BehaviorSubject<string>('../../assets/user.png'); // 116 cap
 currentPhotoUrl = this.photoUrl.asObservable(); // 116 cap

constructor(private http: HttpClient) { }

changeMemberPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl); // 116 cap
}

login(model: any) {
   return this.http.post(this.baseUrl + 'login', model)
   .pipe(
      map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user)); // 114
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user; // 114
            this.changeMemberPhoto(this.currentUser.photoUrl); // 116
            // console.log(this.decodedToken);
          }
      })
   );
 }

 register(model: any) {
   return this.http.post(this.baseUrl + 'register' , model);
 }

 loggedIn() {
   const token = localStorage.getItem('token');
   return !this.jwtHelper.isTokenExpired(token);
 }

}
