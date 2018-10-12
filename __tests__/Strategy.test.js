import { OAuth2 } from 'oauth';

import { OAuth2RopcStrategy } from '../src';
import IllegalArgumentError from '../src/Errors';

jest.mock('oauth');

describe('passport-ropc constructor', () => {
  it('should make a successful constructor call', () => {
    const options = {
      accessTokenURL: '/token',
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };
    const verify = () => {};
    const ropcStrategy = new OAuth2RopcStrategy(options, verify);
    expect(ropcStrategy).toBeDefined();
    expect(OAuth2).toBeCalled();
    expect(OAuth2).toBeCalledWith(options.clientId, options.clientSecret, options.baseSite, '', options.accessTokenURL, options.customHeaders);
    expect(ropcStrategy.verify).toBeDefined();
    expect(ropcStrategy.verify).toEqual(verify);
    expect(ropcStrategy.name).toBeDefined();
    expect(ropcStrategy.name).toEqual('oauth2-ropc');
    expect(ropcStrategy.name).toBeDefined();
    expect(ropcStrategy.passReqToCallback).toEqual(options.passReqToCallback);
  });

  it('should make a successful constructor call using defaults', () => {
    const options = {
      accessTokenURL: 'www.test.com/token',
      clientId: '123',
    };
    const verify = () => {};
    const ropcStrategy = new OAuth2RopcStrategy(options, verify);
    expect(ropcStrategy).toBeDefined();
    expect(OAuth2).toBeCalled();
    expect(OAuth2).toBeCalledWith(options.clientId, null, '', '', options.accessTokenURL, null);
    expect(ropcStrategy.verify).toBeDefined();
    expect(ropcStrategy.verify).toEqual(verify);
    expect(ropcStrategy.name).toBeDefined();
    expect(ropcStrategy.name).toEqual('oauth2-ropc');
    expect(ropcStrategy.name).toBeDefined();
    expect(ropcStrategy.passReqToCallback).toEqual(false);
  });

  it('should throw IllegalArgumentError when accessTokenURL is missing', () => {
    const options = {
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };
    const verify = () => {};
    try {
      // eslint-disable-next-line no-unused-vars
      const ropcStrategy = new OAuth2RopcStrategy(options, verify);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a accessTokenURL option'));
    }
  });

  it('should throw IllegalArgumentError when clientId is missing', () => {
    const options = {
      accessTokenURL: '/token',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };
    const verify = () => {};
    try {
      // eslint-disable-next-line no-unused-vars
      const ropcStrategy = new OAuth2RopcStrategy(options, verify);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new IllegalArgumentError('OAuth2ResourceOwnerStrategy requires a clientId option'));
    }
  });

  it('should throw IllegalArgumentError when verify function is missing', () => {
    const options = {
      accessTokenURL: '/token',
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };
    try {
      // eslint-disable-next-line no-unused-vars
      const ropcStrategy = new OAuth2RopcStrategy(options);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new IllegalArgumentError('ROPC authentication strategy requires a verify function'));
    }
  });
});

describe('passport-ropc authenticate', () => {
  it('should make a successful call', () => {
    const username = 'testUsername';
    const password = 'testPassword';
    const testReq = {
      body: {
        username,
        password,
      },
    };
    const testParams = {
      username,
      password,
      grant_type: 'password',
    };
    const options = {
      accessTokenURL: '/token',
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };
    const expectedAccessToken = 'accessToken';
    const expectedRefreshToken = 'refreshToken';
    const expectedResults = {
      access_token: expectedAccessToken,
    };

    const verify = (req, accessToken, refreshToken, results, verified) => {
      expect(req).toBeDefined();
      expect(req).toEqual(testReq);
      expect(accessToken).toBeDefined();
      expect(accessToken).toEqual(expectedAccessToken);
      expect(refreshToken).toBeDefined();
      expect(refreshToken).toEqual(expectedRefreshToken);
      expect(results).toBeDefined();
      expect(results).toEqual(expectedResults);
      expect(verified).toBeDefined();
      expect(verified).toBeInstanceOf(Function);
    };
    const spy = jest.spyOn(OAuth2.prototype, 'getOAuthAccessToken').mockImplementation((code, params, callback) => {
      callback(null, expectedAccessToken, expectedRefreshToken, expectedResults);
    });
    const ropcStrategy = new OAuth2RopcStrategy(options, verify);
    ropcStrategy.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    spy.mockRestore();
  });
});
