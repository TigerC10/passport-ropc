import { OAuth2 } from 'oauth';

import { OAuth2RopcStrategy } from '../src';
import IllegalArgumentError from '../src/Errors';
import StrategyDecorator from './utils/StrategyDecorator';

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

    // eslint-disable-next-line no-unused-vars
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
    const decorator = new StrategyDecorator(options, verify);
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    spy.mockRestore();
  });

  it('should fail if username is not in req.body', () => {
    const password = 'testPassword';
    const testReq = {
      body: {
        password,
      },
    };
    const options = {
      accessTokenURL: '/token',
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };

    // eslint-disable-next-line no-unused-vars
    const verify = (req, accessToken, refreshToken, results, verified) => {};
    const decorator = new StrategyDecorator(options, verify);
    // eslint-disable-next-line no-unused-vars
    const spy = jest.spyOn(decorator, 'fail').mockImplementation((challenge, status) => {});
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Missing credentials', 400);
  });

  it('should fail if password is not in req.body', () => {
    const username = 'testUsername';
    const testReq = {
      body: {
        username,
      },
    };
    const options = {
      accessTokenURL: '/token',
      clientId: '123',
      clientSecret: '123',
      baseSite: 'www.test.com',
      customHeaders: {},
      passReqToCallback: true,
    };

    // eslint-disable-next-line no-unused-vars
    const verify = (req, accessToken, refreshToken, results, verified) => {};
    const decorator = new StrategyDecorator(options, verify);
    // eslint-disable-next-line no-unused-vars
    const spy = jest.spyOn(decorator, 'fail').mockImplementation((challenge, status) => {});
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('Missing credentials', 400);
  });

  it('should return an error when getOAuthAccessToken returns an error', () => {
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

    // eslint-disable-next-line no-unused-vars
    const verify = (req, accessToken, refreshToken, results, verified) => {};
    const spy = jest.spyOn(OAuth2.prototype, 'getOAuthAccessToken').mockImplementation((code, params, callback) => {
      callback(new Error('getOAuthAccessToken Error'), null, null, null);
    });

    const decorator = new StrategyDecorator(options, verify);
    // eslint-disable-next-line no-unused-vars
    const spy2 = jest.spyOn(decorator, 'error').mockImplementation((err) => {});
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    expect(spy2).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(new Error('getOAuthAccessToken Error'));
    spy.mockRestore();
    spy2.mockRestore();
  });

  it('should call verify without req when passReqToCallback is false', () => {
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
      passReqToCallback: false,
    };

    const expectedAccessToken = 'accessToken';
    const expectedRefreshToken = 'refreshToken';
    const expectedResults = {
      access_token: expectedAccessToken,
    };

    const verify = (accessToken, refreshToken, results, verified) => {
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
    const decorator = new StrategyDecorator(options, verify);
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    spy.mockRestore();
  });

  it('should return an error when an error is passed into verified', () => {
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
      passReqToCallback: false,
    };

    const expectedAccessToken = 'accessToken';
    const expectedRefreshToken = 'refreshToken';
    const expectedResults = {
      access_token: expectedAccessToken,
    };

    const verify = (accessToken, refreshToken, results, verified) => {
      expect(verified).toBeDefined();
      expect(verified).toBeInstanceOf(Function);
      verified(new Error('Verified Error'), null, {});
    };
    const spy = jest.spyOn(OAuth2.prototype, 'getOAuthAccessToken').mockImplementation((code, params, callback) => {
      callback(null, expectedAccessToken, expectedRefreshToken, expectedResults);
    });
    const decorator = new StrategyDecorator(options, verify);
    // eslint-disable-next-line no-unused-vars
    const spy2 = jest.spyOn(decorator, 'error').mockImplementation((err) => {});
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    expect(spy2).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith(new Error('Verified Error'));
    spy.mockRestore();
    spy2.mockRestore();
  });

  it('should return a failure when a user fails to authenticate', () => {
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
      passReqToCallback: false,
    };

    const expectedAccessToken = 'accessToken';
    const expectedRefreshToken = 'refreshToken';
    const expectedResults = {
      access_token: expectedAccessToken,
    };

    const verify = (accessToken, refreshToken, results, verified) => {
      expect(verified).toBeDefined();
      expect(verified).toBeInstanceOf(Function);
      verified(null, null, {});
    };
    const spy = jest.spyOn(OAuth2.prototype, 'getOAuthAccessToken').mockImplementation((code, params, callback) => {
      callback(null, expectedAccessToken, expectedRefreshToken, expectedResults);
    });
    const decorator = new StrategyDecorator(options, verify);
    // eslint-disable-next-line no-unused-vars
    const spy2 = jest.spyOn(decorator, 'fail').mockImplementation((challenge, status) => {});
    decorator.authenticate(testReq, null);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('', testParams, expect.any(Function));
    expect(spy2).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledWith('User failed to authenticate', 404);
    spy.mockRestore();
    spy2.mockRestore();
  });
});
