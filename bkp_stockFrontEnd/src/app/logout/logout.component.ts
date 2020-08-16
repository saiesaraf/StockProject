import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthenticationService } from '../authentication.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: SocialAuthService,
    private flashMessage: FlashMessagesService,
    private Authlocal: AuthenticationService,
    private data: DataService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.signOut();
    this.Authlocal.removeUserFromStorage();
    this.authService.signOut();
    this.data.isloggedin = false;
    this.flashMessage.show('You are successfully logged out', {cssClass: 'alert-success', timeout: 3000});
    this.router.navigate(['mainHome']);
  }

}
