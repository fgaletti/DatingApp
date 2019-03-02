import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() valuesFromHome: any; // 43
 @Output() cancelRegister = new EventEmitter();


  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService ) { }

  ngOnInit() {
  }

  register() {
    console.log(this.model);
    this.authService.register(this.model).subscribe(
      () => {
        this.alertify.success('registration succesfull');
      }, error => {
        console.log(error);
        this.alertify.error(error);
      }
    );
  }


  cancel() {
    this.cancelRegister.emit(false);
    // this.alertify.message(('cancel');
  }

}
