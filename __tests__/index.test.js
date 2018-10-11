import Strategy, { OAuth2RopcStrategy } from '../src';

describe('passport-ropc', () => {
  it('Default export is available', () => {
    const ropcStrategy = new OAuth2RopcStrategy({tokenURL: '123', clientID: '123'}, () => {});
    expect(ropcStrategy).toBeDefined();
  });

  it('Named export is available', () => {
    const ropcStrategy = new Strategy({tokenURL: '123', clientID: '123'}, () => { });
    expect(ropcStrategy).toBeDefined();
  });
});
