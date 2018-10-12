import { OAuth2RopcStrategy } from '../../src';

/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export default class StrategyDecorator extends OAuth2RopcStrategy {
  // eslint-disable-next-line no-useless-constructor
  constructor(options, verify) {
    super(options, verify);
  }

  fail(challenge, status) {}

  success(user, info) {}

  redirect(url, status) {}

  pass() {}

  error(err) {}
}
