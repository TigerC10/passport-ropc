import PassportStrategy from 'passport-strategy';
import { OAuth2 } from 'oauth';

import IllegalArgumentError from './Errors';

const defaultAuthenticateOptions = {
  grant_type: 'password',
};

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
    } = options;

    if (!accessTokenURL) { throw new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a accessTokenURL option'); }
    if (!clientId) { throw new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a clientId option'); }

    if (!this.verify) {
      throw new IllegalArgumentError('ROPC authentication strategy requires a verify function');
    }

    this.name = 'oauth2-ropc';

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
   * @param {string} req.body Request body.
   * @param {string} [req.body.username] Username for login, required for grant type `password`.
   * @param {string} [req.body.password] Password for login, required for grant type `password`.
   * @param {string} [req.body.code] Token for login, required for grant type `authorization_code`.
   * @param {Object} [options] Strategy-specific options.
   * @param {Object} [options.grant_type] The grant type to use, defaults to `password`.
   * @api public
   */
  authenticate(req, options = defaultAuthenticateOptions) {
    const opts = {
      ...defaultAuthenticateOptions,
      ...options,
    };

    let token = '';

    const params = {
      grant_type: opts.grant_type,
    };

    if (opts.grant_type === 'password') {
      const { username, password } = req.body;

      if (!username || !password) {
        return this.fail('Missing credentials', 400);
      }

      params.username = username;
      params.password = password;
    }

    if (opts.grant_type === 'refresh_token') {
      const { code } = req.body;

      if (!code) {
        return this.fail('Missing token', 400);
      }

      params.refresh_token = code;
      token = code;
    }

    return this.oauth2.getOAuthAccessToken(token, params,
      (err, accessToken, refreshToken, results) => {
        if (err) {
          return this.error(err);
        }

        return this.verify(accessToken, refreshToken, results, (e, user, info = {}) => {
          if (e) {
            return this.error(e);
          }

          if (!user) {
            return this.fail('User failed to authenticate', 404);
          }

          // Add refreshToken to user
          Object.assign(user, { refresh_token: refreshToken });

          return this.success(user, info);
        });
      });
  }
}

export default Strategy;
