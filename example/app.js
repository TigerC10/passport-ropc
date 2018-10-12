/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { OAuth2RopcStrategy } from '../src';

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
    // baseURL: 'http://test.com',
    accessTokenURL: 'https://idmsupplier-q.cloud.sysco.com/mga/sps/oauth/oauth20/token',
    clientId: 'oPQWZaXbHeFfCZu0Krcu',
  },
  (accessToken, refreshToken, results, verified) => {
    verified(null, results);
  },
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route to start a login with ROPC
app.post(
  '/login',
  passport.authenticate('oauth2-ropc', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.send(req.user);
  },
);

app.get('/', (req, res) => {
  res.send('<h2>ROPC Authentication</h2><form action="/login" method="post">Username:<br><input type="text" name="username"><br>Password:<br><input type="password" name="password"><br><br><input type="submit" value="Submit"> </form>');
});

app.listen(port);
// eslint-disable-next-line no-console
console.info(`Example listening on port ${port}`);
