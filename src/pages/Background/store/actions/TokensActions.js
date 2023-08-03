import browser from 'webextension-polyfill';
import { SET_SELECTED_TOKEN, SET_TOKENS_DATA } from '../types';

export const getTokensList = (
  dispatch,
  currentNetwork,
  currentAccountIndex,
  successCallback
) => {
  browser.storage.sync
    .get('tokens_info')
    .then((res) => {
      const data = res.tokens_info;
      const tokensData = data.tokensData;
      const tokensList = tokensData[currentNetwork.toString()]
        ? tokensData[currentNetwork.toString()][currentAccountIndex]
          ? tokensData[currentNetwork.toString()][currentAccountIndex]
              .tokensList
          : []
        : [];
      successCallback(tokensList);
    })
    .catch((err) => {
      console.log('Token actions: ERROR!!!!!: ', err);
      successCallback([]);
    });
};

export const addToken = (
  dispatch,
  data,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  const { token, currentNetwork, currentAccountIndex } = data;
  browser.storage.sync
    .get('tokens_info')
    .then((res) => {
      let mainData = res.tokens_info;
      let data = mainData.tokensData;
      if (!data[currentNetwork.toString()]) {
        data[currentNetwork.toString()] = {};
      }
      if (!data[currentNetwork.toString()][currentAccountIndex]) {
        data[currentNetwork.toString()][currentAccountIndex] = {
          tokensList: [],
        };
      }
      let foundIndex = data[currentNetwork.toString()][
        currentAccountIndex
      ].tokensList.findIndex((e) => e.tokenAddress == token.tokenAddress);
      if (foundIndex >= 0) {
        failCallback('This is token is now being used.');
      } else {
        data[currentNetwork.toString()][currentAccountIndex].tokensList.push(
          token
        );
        const storingData = {
          tokensData: data,
          selectedToken: '',
        };
        browser.storage.sync
          .set({ tokens_info: storingData })
          .then(() => {
            dispatch({ type: SET_TOKENS_DATA, payload: storingData });
            setTimeout(() => {
              successCallback();
            }, 0);
          })
          .catch((err) => {
            console.log('Token actions: ERROR!!!!!: ', err);
            failCallback();
          });
      }
    })
    .catch((err) => {
      console.log('Token actions: ERROR!!!!!: ', err);
      failCallback();
    });
};

export const setSelectedToken = (dispatch, token) => {
  dispatch({ type: SET_SELECTED_TOKEN, payload: token });
};

export const loadTokensDataFromStorage = (dispatch) => {
  browser.storage.sync
    .get('tokens_info')
    .then((res) => {
      const data = res.tokens_info;
      dispatch({
        type: SET_TOKENS_DATA,
        payload: { ...data, selectedToken: '' },
      });
    })
    .catch((err) => {
      console.log('Token actions: ERROR!!!!!: ', err);
    });
};

export const removeToken = (
  dispatch,
  data,
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  const { tokenAddress, currentNetwork, currentAccountIndex } = data;
  browser.storage.sync
    .get('tokens_info')
    .then((res) => {
      let mainData = res.tokens_info;
      let data = mainData.tokensData;

      let foundIndex = data[currentNetwork.toString()][
        currentAccountIndex
      ].tokensList.findIndex((token) => token.tokenAddress == tokenAddress);
      console.log(
        data[currentNetwork.toString()][currentAccountIndex].tokensList
      );
      if (foundIndex >= 0) {
        data[currentNetwork.toString()][currentAccountIndex].tokensList.splice(
          foundIndex,
          1
        );
      }
      const storingData = {
        tokensData: data,
        selectedToken: '',
      };
      console.log(
        data[currentNetwork.toString()][currentAccountIndex].tokensList
      );
      browser.storage.sync
        .set({ tokens_info: storingData })
        .then(() => {
          dispatch({ type: SET_TOKENS_DATA, payload: storingData });
          setTimeout(() => {
            successCallback();
          }, 0);
        })
        .catch((err) => {
          console.log('Token actions: ERROR!!!!!: ', err);
          failCallback();
        });
    })
    .catch((err) => {
      console.log('Token actions: ERROR!!!!!: ', err);
      failCallback();
    });
};
