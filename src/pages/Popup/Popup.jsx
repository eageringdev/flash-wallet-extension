import React, { useEffect, useState } from 'react';
import './Popup.scss';
import browser from 'webextension-polyfill';

import App from '../App/App';

//import proxyStore
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
const proxyStore = new Store();

// import loading
import StoreReadyLoading from '../App/screens/StoreReadyLoading';

const Popup = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    proxyStore.ready().then(() => {
      setIsStoreReady(true);
      browser.storage.sync.get('wallets_info').then((res) => {
        const data = res.wallets_info;
        if (!(data && data.isInitialized)) {
          browser.runtime.sendMessage({ fullScreenTabOpen: true });
        }
      });
    });
  }, []);

  return (
    <>
      {isStoreReady ? (
        <Provider store={proxyStore}>
          <App />
        </Provider>
      ) : (
        <StoreReadyLoading />
      )}
    </>
  );
};

export default Popup;
