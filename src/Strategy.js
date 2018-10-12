import PassportStrategy from 'passport-strategy';
import { OAuth2 } from 'oauth';

import IllegalArgumentError from './Errors';

/**
 * Creates an instance of `OAuth2RopcStrategy`.
 *
 * @class
 */
class Strategy extends PassportStrategy {
  constructor(options, verify) {
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
    if (!username || !password) {
      return this.fail('Missing credentials', 400);
    }

    const params = {
      username,
      password,
      grant_type: 'password',
    };

    this.oauth2.getOAuthAccessToken('', params, (err, accessToken, refreshToken, results) => {
      if (err) {
        this.error(err);
      }

      // eslint-disable-next-line consistent-return
      this.verify(accessToken, refreshToken, results, (e, user, info = {}) => {
        if (e) {
          return this.error(e);
        }

        if (!user) {
          return this.fail('User failed to authenticate', 404);
        }

        this.success(user, info);
      });
    });
  }
}

export default Strategy;
