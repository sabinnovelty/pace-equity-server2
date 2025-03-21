export const cryptoConfig = {
  delimiter: '.',

  // hash
  hashIterations: 10000, // Number of iterations
  hashKeylen: 64, // Use the same key length as during the initial hashing
  hashDigest: 'sha512', // The hash algorithm to use

  // encryption
  defaultEncryptionAlgorithm: 'aes-256-cbc',
};
