import { NextFunction, Request, Response, Router } from "express";
import * as passport from "passport";

const loginRouter: Router = Router();

loginRouter.post("/signup", passport.authenticate('local-signup'),
  (req : Request, res: Response) => {
    // `req.user` contains the authenticated user.
    res.json({login: true});
  }
);

// login method
loginRouter.post("/", passport.authenticate('local'),
  (req : Request, res: Response) => {
    // `req.user` contains the authenticated user.
    res.json({login: true});
  }
);

loginRouter.get('/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    res.redirect('/');
});

export { loginRouter };
