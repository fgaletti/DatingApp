import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

/*const  httpOptions = {
    headers: new HttpHeaders({
      'Authorization' : 'Bearer ' +  localStorage.getItem('token')
    })
}; */

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl =  environment.apiUrl;

constructor(private http: HttpClient) {
}

getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users'); // pass authorization
  }

getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  // 99
updateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user);
}

// 111
setMainPhoto (userId: number, id: number ) {
  // http://localhost:5000/api/users/3/photos/14/SetMainPhoto
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/SetMainPhoto', {} ) ;
  // because is a post request we are required to send up something in the body
  // we are sending {}, empty objects to satisfy
}

// 118 cap
deletePhoto(userId: number, id: number) {
  // http://localhost:5000/api/users/3/photos/14
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

}
