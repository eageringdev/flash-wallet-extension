import browser from 'webextension-polyfill';
import {
  SET_BASE_CURRENCY,
  SET_CURRENT_LANGUAGE,
  SET_PRIVACY_CURRENCY,
  SET_SETTINGS_DATA,
  SET_SEARCH_ENGINE,
  SET_AUTOLOCK_TIME,
  SET_INCOMING_TXN,
  SET_INMETA_METRICS,
  SET_PRIVACY_MODE,
  SET_SIGNIN_WITH_FACEID,
} from '../types';

export const loadSettingsDataFromStorage = (dispatch) => {
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      const settingsInfo = res.settings_info;
      dispatch({ type: SET_SETTINGS_DATA, payload: settingsInfo });
    })
    .catch((err) => {
      console.log('Settings Action ERROR:::: ', err);
    });
};

export const setBaseCurrency = (dispatch, value) => {
  dispatch({ type: SET_BASE_CURRENCY, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.baseCurrency = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('base currency setting info updated successfully.');
        })
        .catch((err) => {
          console.log('base currency update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setPrivacyCurrency = (dispatch, value) => {
  dispatch({ type: SET_PRIVACY_CURRENCY, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.privacyCurrency = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('privacy currency setting info updated successfully.');
        })
        .catch((err) => {
          console.log('privacy currency update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setCurrentLanguage = (dispatch, value) => {
  dispatch({ type: SET_CURRENT_LANGUAGE, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.currentLanguage = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('language setting info updated successfully.');
        })
        .catch((err) => {
          console.log('language update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setSearchEngine = (dispatch, value) => {
  dispatch({ type: SET_SEARCH_ENGINE, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.searchEngine = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('search engine setting info updated successfully.');
        })
        .catch((err) => {
          console.log('search engine update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setAutoLockTime = (dispatch, value) => {
  dispatch({ type: SET_AUTOLOCK_TIME, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.autoLockTime = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('autolock time setting info updated successfully.');
        })
        .catch((err) => {
          console.log('autolock time update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setSignInWithFaceId = (dispatch, value) => {
  dispatch({ type: SET_SIGNIN_WITH_FACEID, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.signInWithFaceId = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('SignInWithFaceId setting info updated successfully.');
        })
        .catch((err) => {
          console.log('SignInWithFaceId update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setPrivacyMode = (dispatch, value) => {
  dispatch({ type: SET_PRIVACY_MODE, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.privacyMode = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('privacyMode setting info updated successfully.');
        })
        .catch((err) => {
          console.log('privacyMode update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setInMetaMetrics = (dispatch, value) => {
  dispatch({ type: SET_INMETA_METRICS, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.inMetaMetrics = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('inMetaMetrics setting info updated successfully.');
        })
        .catch((err) => {
          console.log('inMetaMetrics update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};

export const setIncomingTxn = (dispatch, value) => {
  dispatch({ type: SET_INCOMING_TXN, payload: value });
  browser.storage.sync
    .get('settings_info')
    .then((res) => {
      let data = res.settings_info;
      data.incomingTxn = value;
      browser.storage.sync
        .set({ settings_info: data })
        .then(() => {
          console.log('incomingTxn setting info updated successfully.');
        })
        .catch((err) => {
          console.log('incomingTxn update ERROR: ', err);
        });
    })
    .catch((err) => {
      console.log('get setting info ERROR: ', err);
    });
};
