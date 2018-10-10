const defaultMsg = 'Illegal Argument Error';

class IllegalArgumentError extends Error {
  constructor(msg = defaultMsg, args = {}) {
    let m = msg;
    let a = args;

    if (typeof msg === 'object') {
      m = defaultMsg;
      a = msg; // msg is actually the args param
    }

    let fullMessage = m;

    if (Object.keys(a).length > 0) {
      const details = Object.keys(a).map(argKey => `Argument [${argKey}] ${a[argKey]}`).join('\n');
      fullMessage = `${m}:\n${details}`;
    }

    super(fullMessage);
    this.constructor = IllegalArgumentError; // Preserve the constructor after super() call
    this.name = IllegalArgumentError.name; // Prserve the name after super() call
    this.code = 'ERROR_ILLEGAL_ARGUMENT';
    this.msg = m;
    this.argumentMap = a;

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      // This shouldn't be necessary after NodeJS 8.11.2, but keep it in here just in case
      Error.captureStackTrace(this, IllegalArgumentError);
    }
  }

  // Error class restricts normal function creation, make the function as a property instead
  setArgumentValidation = (argumentName, message) => {
    const { msg, argumentMap } = this;
    argumentMap[argumentName] = message;
    const details = Object.keys(argumentMap).map(argKey => `Argument [${argKey}] ${argumentMap[argKey]}`).join('\n');
    this.message = `${msg}:\n${details}`;
  }
}

export default IllegalArgumentError;
