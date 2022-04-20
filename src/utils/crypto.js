// eslint-disable-next-line import/no-unresolved
import CryptoJS from 'crypto-js';

const DEFAULT_DES_KEY = 'kEHrDooxWHCWtfeSxvDvgqZqbeq';

export default (message, key = DEFAULT_DES_KEY) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);

  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};
