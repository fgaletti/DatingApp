import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() valuesFromHome: any; // 43
 @Output() cancelRegister = new EventEmitter();
  // 129 se comenta --> model: any = {};
  user: User; // 129

  registerForm: FormGroup; // 121
  bsConfig: Partial<BsDatepickerConfig>; // 127
  // *** Partial --> make all the PROPERTIES OPTIONAL

    // 125 adds FormBuilder
  constructor(private authService: AuthService, private alertify: AlertifyService ,
    private fb: FormBuilder,
    private router: Router) {} // 128 add router



  ngOnInit() {
     this.bsConfig = {
       containerClass: 'theme-red'
     }, // 127
     this.createRegisterForm(); // 125
      /* // 121
      this.registerForm = new FormGroup({

        username: new FormControl('', Validators.required ),
        password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
        confirmPassword: new FormControl('', Validators.required)
      }, this.passwordMatchValidator); // 123 passwordMatchValidator */
  }

   // 125
  createRegisterForm() {
    // this.createRegisterForm();
    this.registerForm = this.fb.group({
      gender: ['male'], // 126
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],  // 126
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator} );
  }

  // 123
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  register() {
    // 129
    if (this.registerForm.valid) {
       // move the vslues from this.registerForm.value to {}
       this.user = Object.assign({}, this.registerForm.value) ;
       this.authService.register(this.user).subscribe( () => {
         this.alertify.success('Registration successful');
       }, error => {
         this.alertify.error(error);
       }, () => { // third part , complete, we nee to redirect the user once they have register
        console.log('login after register');
        this.authService.login(this.user).subscribe ( () => {
// 129
              this.router.navigate(['/members']); // make sure member exists if not we are not going to get any error message
              console.log('login/member');
            }
           );
       });
    }


   // console.log(this.registerForm.value);


    // this.authService.register(this.model).subscribe(
    //   () => {
    //     this.alertify.success('registration succesfull');
    //   }, error => {
    //     console.log(error);
    //     this.alertify.error(error);
    //   }
    // );
  }


  cancel() {
    this.cancelRegister.emit(false);
    // this.alertify.message(('cancel');
  }

}
