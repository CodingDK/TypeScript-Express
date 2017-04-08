import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  //TODO implement a better handler for this - remove setTimeout part
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let value = this.authService.isLoggedIn();

    if (!this.authService.isFinishFirstRun()) {
      setTimeout(() => {
        value = this.authService.isLoggedIn();
      }, 300);
    }
    if (!value) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    }
    return value;
  }
}
