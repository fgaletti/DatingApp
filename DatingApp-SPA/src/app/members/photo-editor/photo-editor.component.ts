import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/Auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})

// child component of our member edit component
export class PhotoEditorComponent implements OnInit {
 // photos: Photo[];  // 107
@Input() photos: Photo[];  // 107

// EventEmitter from angular core
// 113 cap // we're going to output a string URL ( the photo)
@Output() getMemberPhotoChange = new EventEmitter<string>();

 // 108 cap
 // REMOVE TGHE CRATION TEMPORARILY uploader: FileUploader = new FileUploader({url: URL});
 uploader: FileUploader;

 hasBaseDropZoneOver = false; //  hasBaseDropZoneOver: boolean = false;
 baseUrl = environment.apiUrl;
 currentMain: Photo ; // Current photo that is set to main in the database

 // remove one of this hasAnotherDropZoneOver = false;

// <app-photo-editor [photos]="user.photos">
 // 111: add private userServive: UserService
  constructor(private authService: AuthService, private userServive: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
     this.initializeUploader();
  }
  // 108
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    // 108 avoid Access-Control-Allow-Origin
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        // 130 if the photo is the first photo then update the main photo and then navbar photo
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl =  photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    };
  }
  // 111
  setMainPhoto(photo: Photo) {
    this.userServive.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
      () => {
        this.currentMain = this.photos.filter(p => p.isMain  === true)[0];
        this.currentMain.isMain = false;
        photo.isMain = true;
        // this.getMemberPhotoChange.emit(photo.url); // 113 cap  send to parent  --> (member-edit.html)

        this.authService.changeMemberPhoto(photo.url);

        // now we need to update the Local Storage
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));

        // console.log('success main photo');
      }, error => {
        this.alertify.error(error);
      }
    );
  }

   // 118 cap
  deletePhoto(id: number) {
     // CONFIRM
     this.alertify.confirm('Are you sure you want to delete this photo', () => {
        this.userServive.deletePhoto(this.authService.decodedToken.nameid, id).subscribe( () => {
          // splice => to find the index we need to delete
          this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
          this.alertify.success('Photo has been deleted');
        }, error => {
          this.alertify.error('Failed to delete the photo');
        }); // subscribe
     }); // userServive.end deletePhoto
  }

}
