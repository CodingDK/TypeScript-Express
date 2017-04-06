import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  //TODO make a better fix for scroll-problem than changing page
  onDeactivate() {
    document.body.scrollTop = 0;
  }
}
