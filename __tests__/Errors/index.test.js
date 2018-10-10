import {
  CacheProviderGetError,
  CacheProviderRemoveError,
  CacheProviderSaveError,
  IllegalArgumentError,
} from '../../src/Errors';

describe('Errors', () => {
  it('has CacheProviderGetError', () => {
    expect(CacheProviderGetError).toBeDefined();
  });

  it('has CacheProviderRemoveError', () => {
    expect(CacheProviderRemoveError).toBeDefined();
  });

  it('has CacheProviderSaveError', () => {
    expect(CacheProviderSaveError).toBeDefined();
  });

  it('has IllegalArgumentError', () => {
    expect(IllegalArgumentError).toBeDefined();
  });
});
