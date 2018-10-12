# passport-ropc
ROPC is a form of OAuth for trusted first party development, rather than redirecting the user to a website to log in
separately and approve access a log in (as is typical for traditional OAuth) the user provides the password to the app
that has implemnted ROPC.  Because the user provides the password directly to the implementing app, it should only
be used by first-party app development.

## Supported Grant Types
* password
* refresh_token

## Example
```javascript
const express = require('express');
const passport = require('passport');
const OAuth2RopcStrategy = require('passport-ropc').OAuth2RopcStrategy;

passport.use(new OAuth2RopcStrategy({
  baseURL: 'http://test.com',
  accessTokenURL: '/token',
  clientId: '123'
}, function verify(accessToken, refreshToken, results, done) {
  // Verify that the user exists / has these tokens, then call done()
  done(null, results);
}));

passport.serializeUser(function serialize(user, done) {
  done(null, user);
});

passport.deserializeUser(function deserialize(user, done) {
  done(null, user);
});

const app = express();
// Bring your own bodyparser & session/cookie management

app.post(
  '/login',
  passport.authenticate('oauth2-ropc', { failureRedirect: '/', failureFlash: true, grant_type: 'password' }),
  (req, res) => {
    // Login success, req.user should now be defined
    res.redirect('/');
  },
);

app.post(
  '/refresh',
  passport.authenticate('oauth2-ropc', { failureRedirect: '/', failureFlash: true, grant_type: 'refresh_token' }),
  (req, res) => {
    // Login success, req.user should now be defined
    res.redirect('/');
  },
);

```
