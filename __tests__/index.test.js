import Strategy, { OAuth2RopcStrategy } from '../src';

describe('passport-ropc', () => {
  it('Default export is available', () => {
    const ropcStrategy = new OAuth2RopcStrategy({}, () => {});
    expect(ropcStrategy).toBeDefined();
  });

  it('Named export is available', () => {
    const ropcStrategy = new Strategy({}, () => { });
    expect(ropcStrategy).toBeDefined();
  });
});
