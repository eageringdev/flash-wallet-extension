import browser from 'webextension-polyfill';

import bcrypt from 'bcryptjs';
import constants from '../constants';

export const checkAuthentication = (
  password,
  beforeWork,
  successCallback,
  failCallback,
  errorCallback
) => {
  beforeWork();
  browser.storage.sync
    .get('password')
    .then((data) => {
      bcrypt
        .compare(password, data.password)
        .then((res) => {
          if (res) {
            browser.storage.sync
              .set({
                wallets_info: {
                  isLocked: false,
                  isInitialized: true,
                },
              })
              .then(() => {
                successCallback();
              })
              .catch((err) => {
                console.log('Auth Utils: ERROR!!!!!!!: ', err);
                errorCallback();
              });
          } else {
            failCallback();
          }
        })
        .catch((err) => {
          console.log('Auth Utils: ERROR!!!!!!!: ', err);
          errorCallback();
        });
    })
    .catch((err) => {
      console.log('Auth Utils: ERROR!!!!!!!: ', err);
      errorCallback();
    });
};

export const changePassword = (
  password,
  beforeWork,
  successCallback,
  errorCallback
) => {
  beforeWork();
  bcrypt
    .getSalt(constants.saltRound)
    .then((salt) => {
      bcrypt
        .hash(password, salt)
        .then((hash) => {
          browser.storage.sync
            .set({ password: hash })
            .then(() => {
              successCallback();
            })
            .catch((err) => {
              console.log('change password err: ', err);
              errorCallback();
            });
        })
        .catch((err) => {
          console.log('Change Password error: ', err);
          errorCallback();
        });
    })
    .catch((err) => {
      console.log('Change password error: ', err);
      errorCallback();
    });
};

export const saveRememberOption = (
  rememberMe,
  beforeWork,
  successCallback,
  errorCallback
) => {
  beforeWork();
  browser.storage.sync
    .set({ remember_me: rememberMe })
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.log('Auth Utils: ERROR!!!!!: ', err);
      errorCallback();
    });
};
