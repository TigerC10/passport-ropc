import Strategy, { OAuth2RopcStrategy } from '../src';

describe('passport-ropc exports', () => {
  it('Default export is available', () => {
    const ropcStrategy = new OAuth2RopcStrategy({ accessTokenURL: '123', clientId: '123' }, () => {});
    expect(ropcStrategy).toBeDefined();
  });

  it('Named export is available', () => {
    const ropcStrategy = new Strategy({ accessTokenURL: '123', clientId: '123' }, () => { });
    expect(ropcStrategy).toBeDefined();
  });
});
