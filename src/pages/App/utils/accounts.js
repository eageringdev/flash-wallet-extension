import { hdkey } from 'ethereumjs-wallet';
import { ethers } from 'ethers'

const avatarsCount = require('../constants').default.avatarsCount;

const createInitialAccountFromMasterSeed = (masterSeed) => {
  let path = "m/44'/60'/" + 0 + "'/" + 0 + "'/" + 0;
  let hdwallet = hdkey.fromMasterSeed(masterSeed);
  let wallet = hdwallet.derivePath(path).getWallet();
  let address = '0x' + wallet.getAddress().toString('hex');
  let privateKey = wallet.getPrivateKey().toString('hex');
  return {
    name: 'Account 1',
    privateKey,
    address,
    icon: 0,
    path,
    index: 0,
    isImported: false,
  };
};

const generateNewAccount = (masterSeed, path, accountName, index) => {
  let hdwallet = hdkey.fromMasterSeed(masterSeed);
  let wallet = hdwallet.derivePath(path).getWallet();
  let address = '0x' + wallet.getAddress().toString('hex');
  let privateKey = wallet.getPrivateKey().toString('hex');
  return {
    name: accountName,
    privateKey,
    address,
    icon: Math.floor(Math.random() * avatarsCount) % avatarsCount,
    path,
    index,
    isImported: false,
  };
};

const generateAccountFromPrivateKey = ({ privateKey, accountName, index }) => {
  let address = ethers.utils.computeAddress('0x' + privateKey);
  return {
    name: accountName,
    privateKey,
    address,
    icon: Math.floor(Math.random() * avatarsCount) % avatarsCount,
    index,
    isImported: true,
  };
};

export {
  createInitialAccountFromMasterSeed,
  generateNewAccount,
  generateAccountFromPrivateKey,
};
