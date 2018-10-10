class InvalidProtocolError extends Error {
  static defaultMessage = 'Invalid SAML Protocol';

  constructor(message = InvalidProtocolError.defaultMessage, ...args) {
    super(message, ...args);
    Object.defineProperties(this, {
      constructor: {
        value: InvalidProtocolError,
      },
      name: {
        value: InvalidProtocolError.name,
      },
    });
    this.code = 'ERROR_INVALID_SAML_PROTOCOL';

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      // This shouldn't be necessary after NodeJS 8.11.2, but keep it in here just in case
      Error.captureStackTrace(this, InvalidProtocolError);
    }
  }
}

export default InvalidProtocolError;
