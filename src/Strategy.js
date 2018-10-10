import PassportStrategy from 'passport-strategy';
import { OAuth2 } from 'oauth';

import { IllegalArgumentError } from './errors';

const defaultOptions = {
  passReqToCallback: false,

}

/**
 * Creates an instance of `ROPC Strategy`.
 *
 * @class
 */
class Strategy extends PassportStrategy {
  constructor(options = defaultOptions, verify) {
    super();

    if (typeof options === 'function') {
      this.verify = options;
      this.options = {};
    }

    const { tokenURL, clientID } = options;

    if (!tokenURL) { throw new TypeError('OAuth2ResourceOwnerStrategy requires a tokenURL option'); }
    if (!clientID) { throw new TypeError('OAuth2ResourceOwnerStrategy requires a clientID option'); }
    // if (!clientSecret) { throw new TypeError('OAuth2ResourceOwnerStrategy requires a clientSecret option'); }

    // Check the preconditions
    let constructorError = null;
    if (!this.verify) {
      constructorError = constructorError || new IllegalArgumentError();
      // constructorError.setIllegalArgument('verify', 'ROPC authentication strategy requires a verify function');
      throw constructorError;
    }

    this.name = 'oauth2-ropc';
    this._passReqToCallback = options.passReqToCallback;
    this._verify = verify;

    this._oauth2 = new OAuth2(clientID, null, '', tokenURL, null);
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
  authenticate(req, options) {
    const { username, password } = req.body;
    const { clientId } = options;
    if (!username || !password) {
      return this.fail({ message: 'Missing credentials' }, 400);
    }


    if (this._passReqToCallback) {
      this._verify(req, clientId, username, password, this.verified);
    } else {
      this._verify(clientId, username, password, this.verified);
    }

    const params = {
      username,
      password,
      grant_type: 'password',
    };

    this._oauth2.getOAuthAccessToken('', params, function(err, accessToken, refreshToken, params) {
      if (err) {
      //  new error
        this.error(err);
      }

      if (this._passReqToCallback) {
        this._verify(req, accessToken, refreshToken, params, this.verified);
      }
      else {
        this._verify(accessToken, refreshToken, params, this.verified);

      }

    });

  }

  verified = (err, user, info) => {
    if (err) { return this.error(err); }
    if (!user) { return this.fail(info); }

    this.success(user, info = {});
  }

  /**
   *
   * @param {*} req
   * @param {*} callback
   */
  logout(req, callback) {

  }

  /**
   *
   * @param {string} decryptionCert
   */
  generateServiceProviderMetadata(decryptionCert) {

  }
}

export default Strategy;
