import browser from 'webextension-polyfill';

import {
  SET_NETWORKS_DATA,
  SET_CURRENT_NETWORK,
  SET_NETWORK_GAS_PRICE,
} from '../types';

export const loadNetworksDataFromStorage = (dispatch) => {
  browser.storage.sync
    .get('networks_info')
    .then((res) => {
      const data = res.networks_info;
      dispatch({ type: SET_NETWORKS_DATA, payload: data });
    })
    .catch((err) => {
      console.log('NetworkActions: ERROR!!!!!!: ', err);
    });
};

export const setCurrentNetwork = (dispatch, network) => {
  dispatch({ type: SET_CURRENT_NETWORK, payload: network });
  browser.storage.sync
    .get('networks_info')
    .then((res) => {
      let data = res.networks_info;
      data.currentNetwork = network;
      browser.storage.sync
        .set({
          networks_info: data,
        })
        .then(() => {
          console.log(
            'Network Actions: saved currentNetwork to asyncStroage Successfully'
          );
        })
        .catch((err) => {
          console.log('Network Actions: ERROR!!!!: ', err);
        });
    })
    .catch((err) => {
      console.log('Network Actions: ERROR!!!!: ', err);
    });
};

export const setNetworkGasPrice = (dispatch, price) => {
  dispatch({ type: SET_NETWORK_GAS_PRICE, payload: price });
};
