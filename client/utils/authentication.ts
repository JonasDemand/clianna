import crypto from 'crypto';

export const hashPassword = (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((res) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, hash) => {
      if (err) throw err;
      res(hash.toString('hex'));
    });
  });
};

export const createSalt = (): string => crypto.randomBytes(128).toString('hex');
