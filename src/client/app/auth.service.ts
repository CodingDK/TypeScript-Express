import { Injectable } from '@angular/core';
import { LoginViewModel } from '../../shared/models/loginViewModel';

import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {
  private loggedIn: boolean = false;

  private loginUrl = 'http://localhost:3000/api/login';
  private logoutUrl = 'http://localhost:3000/api/login/logout';
  private statusUrl = 'http://localhost:3000/api/login/status';

  constructor(private http: Http, private router: Router) {
    this.http.get(this.statusUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        //const loggedIn = response.status == 200;
        this.loggedIn = response.json().login;
        //console.log("response", response);
        //console.log("responseJson", response.json());
        //return false;
      })
      .catch(this.handleError);
  }

  // This method will display the lock widget
  login(loginModel: LoginViewModel) : Promise<boolean> {
    console.log("service: loginModel: ", loginModel);

    return this.http.post(this.loginUrl, loginModel, { withCredentials: true })
      .toPromise()
      .then(response => {
        const loggedIn = response.status == 200;
        this.loggedIn = loggedIn;
        //console.log("response", response);
        //console.log("responseJson", response.json());
        return loggedIn;
      });
  }

  // This method will log the use out
  logout() {
    this.http.get(this.logoutUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        //const loggedIn = response.status == 200;
        //console.log("response", response);
        //console.log("responseJson", response.json());
        this.loggedIn = false;
      })
      .catch(this.handleError);
    this.router.navigateByUrl('/login');
  }
  
  isLoggedIn() {
    return this.loggedIn;
  }
  
  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('AuthService - An error occurred', error);
    return Promise.reject(error.message || error);
  }
}