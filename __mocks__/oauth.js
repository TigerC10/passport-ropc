 
exports.OAuth2 = jest.fn((
  clientId,
  clientSecret,
  baseSite,
  authorizePath,
  accessTokenPath,
  customHeader,
) => {});

exports.OAuth2.prototype.getOAuthAccessToken = jest.fn();
