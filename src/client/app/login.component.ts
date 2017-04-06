import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginViewModel } from '../../shared/models/loginViewModel';

@Component({
  selector: 'login-form',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  model = new LoginViewModel("", "");
  isSubmitted = false;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {
    
  }

  submit() {
    this.isSubmitted = true;
    const tempModel = this.model;
    this.model = new LoginViewModel(tempModel.email, "");
    this.authService.login(tempModel)
      .then(response => {
        this.router.navigateByUrl('/home');
      }).catch(err => {
        if (err.status == 401) {
          this.errorMessage = "Wrong Username or password";
        } else {
          this.errorMessage = `Unknown Error - code: ${err.status} - ${err.statusText}`;
        }
      });
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }
}
