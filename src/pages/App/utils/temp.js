import browser from 'webextension-polyfill';

export const checkTempPassword = (
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local.get('tempPassword').then((res) => {
    if (res.tempPassword && res.tempPassword.length > 0) {
      successCallback();
    } else {
      failCallback();
    }
  });
};

export const checkTempMnemonic = (
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local.get('tempMnemonic').then((res) => {
    if (res.tempMnemonic && res.tempMnemonic.length > 0) {
      successCallback();
    } else {
      failCallback();
    }
  });
};

export const checkTempPasswordAndMnemonic = (
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local.get(['tempMnemonic', 'tempPassword']).then((res) => {
    if (
      res.tempMnemonic &&
      res.tempMnemonic.length > 0 &&
      res.tempPassword &&
      res.tempPassword.length > 0
    ) {
      successCallback({
        password: res.tempPassword,
        mnemonic: res.tempMnemonic,
      });
    } else {
      failCallback();
    }
  });
};

export const setTempPassword = (
  data,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local
    .set({
      tempPassword: data,
    })
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.log('Temp Utils Error: ', err);
      failCallback();
    });
};

export const setTempMnemonic = (
  data,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  browser.storage.local
    .set({
      tempMnemonic: data,
    })
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.log('Temp Utils Action Error: ', err);
      failCallback();
    });
};

export const clearTempStorage = (beforeWork, successCallback, failCallback) => {
  beforeWork();
  browser.storage.local
    .clear()
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.log('Temp Utils Action Error: ', err);
      failCallback();
    });
};

export const saveLastOpenTime = () => {
  browser.storage.local.set({
    lastOpenTime: Data.now(),
  });
};
