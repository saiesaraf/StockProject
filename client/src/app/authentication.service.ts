import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from './data.service';

const MINUTES_UNITL_AUTO_LOGOUT = 10;
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private token: string;
  constructor(private data: DataService, private http: HttpClient, private router: Router,  private ngZone: NgZone) {
    this.initInterval();
  }
  removeUserFromStorage() {
    localStorage.clear();
  }

  storeUserUse(user) {
    localStorage.setItem('user', user);
    const date = new Date().getTime();
    localStorage.setItem('loginTime', date.toString());
   // console.log('localstorage data' + localStorage.getItem('loginTime') );

  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', user);
    const date = new Date().getTime();
    localStorage.setItem('loginTime', date.toString());
    //console.log('localstorage data' + localStorage.getItem('loginTime') );

  }

  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, 10000);
    });
  }

  check() {
    const now = new Date().getTime()
    //console.log('current time is' + now);
    const loginTime = localStorage.getItem('loginTime');
   // console.log('login time is' + loginTime);
    //const dt = new Date(loginTime)

    //console.log('login time ' + dt)

  //const timeleft =  dt + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
   // const diff = timeleft - now;

    const timeSinceLogIn = now - parseInt(loginTime);
    //console.log('time since logged in ' + timeSinceLogIn);

    this.ngZone.run(() => {
      if (this.data.isloggedin && timeSinceLogIn >= MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000) {
        //console.log(`Sie wurden automatisch nach ${MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);
        //console.log('logged out done ready for S')
        //this.auth.logout();
        this.router.navigate(['logout']);
      }
    });
  }
}
