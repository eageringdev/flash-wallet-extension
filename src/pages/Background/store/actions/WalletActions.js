import browser from 'webextension-polyfill';

import { SET_INITIAL_ACCOUNT_DATA, SET_WALLET_DATA } from '../types';
import bcrypt from 'bcryptjs';
import Constants from '../../../App/constants';

import { utils } from 'ethers';

import { createInitialAccountFromMasterSeed } from '../../../App/utils/accounts';

import {
  initialSettings,
  NetworkList,
  RINKEBY,
} from '../../../App/engine/constants';

export const createWallet = (
  dispatch,
  data,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local.clear();
  bcrypt
    .genSalt(Constants.saltRound)
    .then((salt) => {
      const { password, mnemonic } = data;
      const masterSeedString = utils.mnemonicToSeed(mnemonic).slice(2);
      const masterSeed = Buffer.from(masterSeedString, 'hex');
      bcrypt
        .hash(password, salt)
        .then((hash) => {
          const initialAccountData =
            createInitialAccountFromMasterSeed(masterSeed);
          const accountsInfo = {
            accounts: [initialAccountData],
            currentAccountIndex: 0,
          };
          const networksInfo = {
            networks: NetworkList,
            currentNetwork: RINKEBY,
          };
          const balancesInfo = {
            [initialAccountData.address]: { main: '0' },
          };
          const networkKeys = Object.keys(NetworkList);
          let tokensInfo = {};
          networkKeys.forEach((key) => {
            tokensInfo[key] = {
              [initialAccountData.address]: {
                tokensList: [],
              },
            };
          });
          const storingTokensInfo = {
            tokensData: tokensInfo,
            selectedToken: '',
          };
          console.log({
            isLocked: true,
            password: hash,
            mnemonic: mnemonic,
            master_seed: masterSeedString,
            accounts_info: accountsInfo,
            networks_info: networksInfo,
            balances_info: balancesInfo,
            tokens_info: storingTokensInfo,
            settings_info: initialSettings,
            nftbalances_info: {},
            deadfunction_info: { will: {}, legacy: [] },
          });
          browser.storage.sync
            .set({
              password: hash,
              mnemonic: mnemonic,
              master_seed: masterSeedString,
              wallets_info: {
                isLocked: true,
                isInitialized: true,
              },
              accounts_info: accountsInfo,
              networks_info: networksInfo,
              balances_info: balancesInfo,
              tokens_info: storingTokensInfo,
              settings_info: initialSettings,
              nftbalances_info: {},
              deadfunction_info: { will: {}, legacy: [] },
            })
            .then(() => {
              dispatch({
                type: SET_INITIAL_ACCOUNT_DATA,
                payload: initialAccountData,
              });
              dispatch({
                type: SET_WALLET_DATA,
                payload: {
                  isLocked: true,
                  isInitialized: true,
                },
              });
              successCallback();
            })
            .catch((err) => {
              console.log('Wallet Actions: ERROR!!!!!: ', err);
              failCallback();
            });
        })
        .catch((err) => {
          console.log('Wallet Actions: ERROR!!!!!: ', err);
          failCallback();
        });
    })
    .catch((err) => {
      console.log('Wallet Actions: ERROR!!!!!: ', err);
      failCallback();
    });
};

export const setWalletData = (dispatch, data) => {
  dispatch({ type: SET_WALLET_DATA, payload: data });
};

export const testAction = (dispatch) => {
  console.log(dispatch);
  dispatch({ type: 'test', payload: 'test' });
};
