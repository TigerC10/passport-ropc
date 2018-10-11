/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import OAuth2RopcStrategy from '../src';

const port = process.env.PORT || 8080;
const sessionKey = process.env.SESSION_KEY || 'passport-ropc-example';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Should be true if site is HTTPS secured
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new OAuth2RopcStrategy(
  {
    baseURL: 'http://test.com',
    accessTokenURL: '/token',
    clientId: '123',
  },
  (accessToken, refreshToken, results, verified) => {
    verified(null, results);
  },
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Route to start a login with IDP
app.post(
  '/login',
  passport.authenticate('oauth2-ropc', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.send(req.user);
  },
);

app.listen(port);
// eslint-disable-next-line no-console
console.info(`Example listening on port ${port}`);
