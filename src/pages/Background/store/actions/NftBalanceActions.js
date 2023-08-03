import browser from 'webextension-polyfill';

import { SET_NFT_BALANCE_UPDATED_INFO } from '../types';

export const addNFT = (
  dispatch,
  data,
  beforeWork,
  successCallback,
  failCallback,
  errorCallback
) => {
  beforeWork();
  const { currentNetwork, currentAccountIndex, nftAddress, nftId } = data;
  //   dispatch({type: SET_NFT_BALANCE_UPDATED_INFO, payload: data});
  browser.storage.sync
    .get('nftbalances_info')
    .then((res) => {
      let info = res.nftbalances_info;
      if (!info[currentNetwork.toString()]) {
        info[currentNetwork.toString()] = {};
      }
      if (!info[currentNetwork.toString()][currentAccountIndex.toString()]) {
        info[currentNetwork.toString()][currentAccountIndex.toString()] = {
          tokensList: [],
        };
      }
      let needUpdate = true;
      let foundIndex = info[currentNetwork.toString()][
        currentAccountIndex.toString()
      ].tokensList.findIndex((e) => e.nftAddress == nftAddress);
      if (foundIndex < 0) {
        info[currentNetwork.toString()][
          currentAccountIndex.toString()
        ].tokensList.push({ nftAddress: nftAddress, idList: [nftId] });
      } else {
        let idIndex = info[currentNetwork.toString()][
          currentAccountIndex.toString()
        ].tokensList[foundIndex].idList.findIndex((e) => e == nftId);
        if (idIndex >= 0) {
          needUpdate = false;
          failCallback('This NFT is now being used.');
        } else {
          info[currentNetwork.toString()][
            currentAccountIndex.toString()
          ].tokensList[foundIndex].idList.push(nftId);
        }
      }
      if (needUpdate) {
        browser.storage.sync
          .set({ nftbalances_info: info })
          .then(() => {
            console.log(info);
            dispatch({ type: SET_NFT_BALANCE_UPDATED_INFO, payload: info });
            successCallback();
          })
          .catch((err) => {
            console.log('addNFT error: ', err);
            errorCallback();
          });
      }
    })
    .catch((err) => {
      console.log('addNFT error: ', err);
      errorCallback();
    });
};

export const loadNftBalancesInfoFromStorage = (dispatch) => {
  browser.storage.sync.get('nftbalances_info').then((res) => {
    let info = res.nftbalances_info;
    dispatch({ type: SET_NFT_BALANCE_UPDATED_INFO, payload: info });
  });
};
