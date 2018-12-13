import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() valuesFromHome: any;
 @Output() cancelRegister = new EventEmitter();


  model: any = {};

  constructor(private authService: AuthService ) { }

  ngOnInit() {
  }

  register() {
    console.log(this.model);
    this.authService.register(this.model).subscribe(
      () => {
        console.log('registration succesfull');
      }, error => {
        console.log(error);
        alert(error);
      }
    );
  }


  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancel');
  }

}
