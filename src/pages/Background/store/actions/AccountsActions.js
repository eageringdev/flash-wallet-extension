import browser from 'webextension-polyfill';

import { SET_ACCOUNTS_DATA, SET_CURRENT_ACCOUNT_INDEX } from '../types';

import AppConstants from '../../../App/constants';
const hardenedOffset = AppConstants.HARDENED_OFFSET;
//import utils
import {
  generateAccountFromPrivateKey,
  generateNewAccount,
} from '../../../App/utils/accounts';

export const loadAccountsDataFromStorage = (dispatch) => {
  browser.storage.sync
    .get('accounts_info')
    .then((res) => {
      const data = res.accounts_info;
      dispatch({ type: SET_ACCOUNTS_DATA, payload: data });
    })
    .catch((err) => {
      console.log('Accounts Actions: ERROR!!!!!!: ', err);
    });
};

export const createNewAccount = (
  dispatch,
  accountName,
  beforeWork,
  successCallback,
  errorCallback
) => {
  beforeWork();
  browser.storage.sync
    .get(['master_seed', 'accounts_info'])
    .then((res) => {
      const masterSeedString = res.master_seed;
      let accountsInfo = res.accounts_info;
      const addresses = accountsInfo.accounts.map((item) => item.address);
      const masterSeed = Buffer.from(masterSeedString, 'hex');
      let path;
      let newAccount;
      while (1) {
        path =
          "m/44'/60'/" +
          (Math.round(Math.random() * 100000000000) % hardenedOffset) +
          "'/" +
          (Math.round(Math.random() * 100000000000) % hardenedOffset) +
          "'/" +
          (Math.round(Math.random() * 100000000000) % hardenedOffset);
        newAccount = generateNewAccount(
          masterSeed,
          path,
          accountName,
          accountsInfo.accounts.length
        );
        let foundIndex = addresses.findIndex(
          (item) => item === newAccount.address
        );
        if (foundIndex < 0) {
          break;
        }
      }
      accountsInfo.accounts.push(newAccount);
      accountsInfo.currentAccountIndex = accountsInfo.accounts.length - 1;
      browser.storage.sync
        .set({
          accounts_info: accountsInfo,
        })
        .then(() => {
          dispatch({ type: SET_ACCOUNTS_DATA, payload: accountsInfo });
          successCallback();
        })
        .catch((err) => {
          console.log('Accounts Action ERROR!!!!!: ', err);
          errorCallback();
        });
    })
    .catch((err) => {
      console.log('ERROR!!!!!: ', err);
      errorCallback();
    });
};

export const setCurrentAccountIndex = (dispatch, index) => {
  dispatch({ type: SET_CURRENT_ACCOUNT_INDEX, payload: index });
  browser.storage.sync
    .get('accounts_info')
    .then((res) => {
      let accountsInfo = res.accounts_info;
      accountsInfo.currentAccountIndex = index;
      browser.storage.sync
        .set({
          accounts_info: accountsInfo,
        })
        .then(() => {
          console.log(
            'Set current Account index: successfully saved in asyncstorage'
          );
        })
        .catch((err) => {
          console.log('AccountsAction: ERROR!!!!: ', err);
        });
    })
    .catch((err) => {
      console.log('AccountsAction: ERROR!!!!: ', err);
    });
};

export const importAccount = (
  dispatch,
  privateKey,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.sync
    .get('accounts_info')
    .then((res) => {
      let accountsInfo = res.accounts_info;
      let foundIndex = accountsInfo.accounts.findIndex(
        (item) => item.privateKey === privateKey
      );
      let importedAccountCount = accountsInfo.accounts.filter(
        (item) => item.isImported === true
      ).length;
      if (foundIndex >= 0) {
        failCallback(
          `That private key is now being used by ${accountsInfo.accounts[foundIndex].name}.`
        );
      } else {
        const importedAccount = generateAccountFromPrivateKey({
          privateKey,
          accountName:
            'Imported Account ' + (importedAccountCount + 1).toString(),
          index: accountsInfo.accounts.length,
        });
        accountsInfo.accounts.push(importedAccount);
        accountsInfo.currentAccountIndex = accountsInfo.accounts.length - 1;
        browser.storage.sync
          .set({ accounts_info: accountsInfo })
          .then(() => {
            dispatch({ type: SET_ACCOUNTS_DATA, payload: accountsInfo });
            successCallback();
          })
          .catch((err) => {
            console.log('Accounts Action ERROR!!!!!: ', err);
            failCallback('ERROR occurs!');
          });
      }
    })
    .catch((err) => {
      console.log('ERROR!!!!: ', err);
      failCallback('ERROR occurs!');
    });
};
