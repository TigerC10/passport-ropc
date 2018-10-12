import PassportStrategy from 'passport-strategy';
import { OAuth2 } from 'oauth';

import IllegalArgumentError from './Errors';

const defaultOptions = {
  passReqToCallback: false,
};

/**
 * Creates an instance of `OAuth2RopcStrategy`.
 *
 * @class
 */
class Strategy extends PassportStrategy {
  constructor(options = defaultOptions, verify) {
    super();

    this.verify = verify;

    const {
      accessTokenURL,
      clientId,
      clientSecret,
      baseSite,
      customHeaders,
      passReqToCallback,
    } = options;

    if (!accessTokenURL) { throw new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a accessTokenURL option'); }
    if (!clientId) { throw new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a clientId option'); }

    if (!this.verify) {
      throw new IllegalArgumentError('ROPC authentication strategy requires a verify function');
    }

    this.name = 'oauth2-ropc';
    this.passReqToCallback = passReqToCallback || false;

    this.oauth2 = new OAuth2(
      clientId,
      clientSecret || null,
      baseSite || '',
      '',
      accessTokenURL,
      customHeaders || null,
    );
  }

  /**
   * Authenticate request.
   *
   * This function must be overridden by subclasses.  In abstract form, it always
   * throws an exception.
   *
   * @param {Object} req The request to authenticate.
   * @param {Object} [options] Strategy-specific options.
   * @api public
   */
  // eslint-disable-next-line no-unused-vars
  authenticate(req, options) { // eslint-disable-line consistent-return
    const { username, password } = req.body;
    const self = this;
    if (!username || !password) {
      return self.fail('Missing credentials', 400);
    }

    const params = {
      username,
      password,
      grant_type: 'password',
    };

    // eslint-disable-next-line consistent-return
    function verified(err, user, info = {}) {
      if (err) { return self.error(err); }
      if (!user) { return self.fail('User failed to authenticate', 404); }

      self.success(user, info);
    }

    this.oauth2.getOAuthAccessToken('', params, (err, accessToken, refreshToken, results) => {
      if (err) {
        self.error(err);
      }

      if (self.passReqToCallback) {
        self.verify(req, accessToken, refreshToken, results, verified);
      } else {
        self.verify(accessToken, refreshToken, results, verified);
      }
    });
  }
}

export default Strategy;
