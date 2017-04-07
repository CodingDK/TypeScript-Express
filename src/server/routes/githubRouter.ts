import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";
import * as request from "request";

const githubRouter: Router = Router();
import config from '../config/config';

githubRouter.get('/commits', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  var options = {
    //url: 'http://localhost:4200/test',
    headers: {
      'User-Agent': 'Application'
    }
  };
  request('https://api.github.com/repos/CodingDK/TypeScript-Express/commits', options, (error: any, response: any, body: any) => {
    //console.log("error", JSON.stringify(error));
    //console.log("response", JSON.stringify(response));
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
      if (config.gitHubSimpleCache == "") {
        config.gitHubSimpleCache = body;
      }
      res.type('json');
      res.send(config.gitHubSimpleCache);
    }
  });
  //res.json(body);
  //res.redirect('/');
});


// route middleware to make sure a user is logged in
function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
  // if user is authenticate in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // in any other case, redirect to the home
  //res.redirect('/');
  res.send(401, { login: false, text: 'Your are not logged in!' });
}

export { githubRouter };
