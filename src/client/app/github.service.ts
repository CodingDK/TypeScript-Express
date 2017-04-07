import { Injectable } from '@angular/core';

import { Headers, Http, Response } from '@angular/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { RootObject } from './github.models';

@Injectable()
export class GithubService {  
  private commitsUrl = 'http://localhost:3000/api/github/commits';
  private data: any;

  constructor(private http: Http, private router: Router) {
    
  }
  
  getAllCommits() : Promise<RootObject[]> {
    return this.http.get(this.commitsUrl, { withCredentials: true })
      .toPromise()
      .then(response => {
        this.data = response.json();
        return response.json();
      })
      .catch(this.handleError);
    //this.router.navigateByUrl('/login');
  }
  
  // Implement a method to handle errors if any
  private handleError(error: any): Promise<any> {
    console.error('GithubService - An error occurred', error);
    return Promise.reject(error.message || error);
  }
}