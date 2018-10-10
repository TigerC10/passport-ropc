import IllegalArgumentError from '../../src/Errors/IllegalArgumentError';

describe('IllegalArgumentError', () => {
  it('can be constructed', () => {
    const testError = new IllegalArgumentError();

    expect(testError.message).toBe('Illegal Argument Error');
  });

  it('can be constructed with a custom message', () => {
    const testError = new IllegalArgumentError('Invalid Argument');

    expect(testError.message).toBe('Invalid Argument');
  });

  it('can be constructed with arguments/validations in the list', () => {
    const testError = new IllegalArgumentError({
      firstArg: 'is required',
      secondArg: 'must be a string',
    });

    expect(testError.message).toEqual(expect.stringMatching(/firstArg/));
    expect(testError.message).toEqual(expect.stringMatching(/secondArg/));
  });

  it('can be constructed with a custom message and custom arguments/validations in the list', () => {
    const testError = new IllegalArgumentError('Invalid Argument', {
      firstArg: 'is required',
      secondArg: 'must be a string',
    });

    expect(testError.message).toEqual(expect.stringMatching(/Invalid Argument/));
    expect(testError.message).toEqual(expect.stringMatching(/firstArg/));
    expect(testError.message).toEqual(expect.stringMatching(/secondArg/));
  });

  it('can add illegal arguments to the list after construction', () => {
    const testError = new IllegalArgumentError();
    testError.setArgumentValidation('firstArg', 'is required');
    testError.setArgumentValidation('secondArg', 'must be a string');

    expect(testError.message).toEqual(expect.stringMatching(/firstArg/));
    expect(testError.message).toEqual(expect.stringMatching(/secondArg/));
  });
});
