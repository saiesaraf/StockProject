import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgForm, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  fname: string;
  lname: string;
  email: string;
  password: string;
  registered: boolean;
  isValidForm: boolean;
  isnameValid: boolean;
  ispasswordValid: boolean;
  inputPassword: string;
  inputPassword2: string;
  constructor(
    private data: DataService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
    this.registered = false;
    this.ispasswordValid = false;
  }

  ngOnInit(): void {
  }

  registerUser(form: NgForm) {
    console.log('I am in registerform');
    if (form.invalid) {
     console.log('name is' + form.value.fname);
     console.log('last name is' + form.value.lname);
     console.log('email' + form.value.email);
     console.log('passoword' + form.value.password);
     return;
    }
    const newUser = {
      name: form.value.fname,
      email: form.value.email,
      password: form.value.password
    };

    this.data.registerUser(newUser).subscribe(registerddata => {
      if (registerddata['success']) {
        this.registered = true;
        this.flashMessage.show('You are now registered and can log in', {
          cssClass: 'alert-success',
          timeout: 3000
        });
        this.router.navigate(['mainHome']);
      } else {
        this.flashMessage.show(JSON.stringify(registerddata['msg']), {
          cssClass: 'alert-danger',
          timeout: 5000
        });
        this.router.navigate(['register']);
      }
    });
  }

  isPasswordInvalid(form: NgForm) {
    const inputPassword = form.value.password;

    const regularExpression = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{4,20}/;
    if (!regularExpression.test(inputPassword)) {
      return true;
    } else {
      return false;
    }
  }

  isPasswordEntered(form: NgForm) {
    if (form.value.password) {
      return true;
    }

    return false;
  }

  NotequalPassword(form: NgForm) {
    const inputPassword = form.value.password;
    const inputPassword2 = form.value.password2;
    if (inputPassword != inputPassword2) {
      return true;
    } else {
      return false;
    }
  }

}
