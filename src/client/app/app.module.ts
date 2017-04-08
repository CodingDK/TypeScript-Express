import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { GithubComponent } from './github.component';

import { AuthGuard } from './auth.guard';
import { GithubService } from './github.service';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    GithubComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule // Must be last import. So Rounting childs works
  ],
  providers: [
    AuthGuard,
    AuthService,
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
