import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { DataService } from '../data.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthenticationService } from '../authentication.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: "app-main-home",
  templateUrl: "./main-home.component.html",
  styleUrls: ["./main-home.component.scss"]
})
export class MainHomeComponent implements OnInit {
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private data: DataService,
    private flashMessage: FlashMessagesService,
    private Authlocal: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log('user is' + user);
    });
  }

  signInWithGoogle(): void {
    console.log('here');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      this.data.isloggedin = true;
      this.data.userId = x.email;
      console.log('user email is' + this.data.userId);
      this.flashMessage.show('You are now logged in successfully!', {
        cssClass: 'alert-success',
        timeout: 3000
      });
      this.router.navigate(['home1']);
    });
  }

  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      this.data.isloggedin = true;
      this.data.userId = x.email;
      console.log('user email is' + this.data.userId);
      this.flashMessage.show('You are now logged in successfully!', {
        cssClass: 'alert-success',
        timeout: 3000
      });
      this.router.navigate(['home1']);
    });
  }

  LoginUser(form: NgForm) {
    console.log('I am in loginUser');
    if (form.invalid) {
      return;
    }
    const prevUser = {
      email: form.value.email,
      password: form.value.password
    };
    console.log('email is' + form.value.email);
    console.log('password is' + form.value.password);
    this.data.loginUser(prevUser).subscribe(loginDetails => {
      if (loginDetails['success']) {
        this.flashMessage.show('You are now logged in successfully!', {
          cssClass: 'alert-success',
          timeout: 3000
        });
        console.log('email is' + form.value.email);
        this.Authlocal.storeUserData(loginDetails.token, form.value.email);
        this.Authlocal.storeUserData(loginDetails.user, form.value.email);
        this.data.userId = form.value.email;
        this.router.navigate(['home1']);
      } else {
        this.flashMessage.show(JSON.stringify(loginDetails['msg']), {
          cssClass: 'alert-danger',
          timeout: 5000
        });
        this.router.navigate(['register']);
      }
    });
  }
}
