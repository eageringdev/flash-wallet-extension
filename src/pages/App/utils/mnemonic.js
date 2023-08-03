import { utils } from 'ethers';
import browser from 'webextension-polyfill';

const createMnemonic = () => {
  const mnemonic = utils.entropyToMnemonic(utils.randomBytes(16));
  return mnemonic;
};

const isValidMnemonic = (mnemonic) => {
  return utils.isValidMnemonic(mnemonic);
};

const loadMnemonic = (successCallback, failCallback) => {
  browser.storage.sync
    .get('mnemonic')
    .then((res) => {
      successCallback(res.mnemonic || '');
    })
    .catch((err) => {
      console.log('mnemonic Utils ERROR::::: ', err);
      failCallback();
    });
};

export { createMnemonic, isValidMnemonic, loadMnemonic };
