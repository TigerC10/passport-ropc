function fail() {}
function success() {}
function redirect() {}
function pass() {}
function error() {}

export default function passportStrategyDecorator(strategy) {
  Object.assign(strategy, {
    fail,
    success,
    redirect,
    pass,
    error,
  });

  return strategy;
}
