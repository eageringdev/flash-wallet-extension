import React, { useEffect, useState } from 'react';
import './Home.scss';

import App from '../App/App';

//import proxyStore
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
const proxyStore = new Store();

// import Loading
import StoreReadyLoading from '../App/screens/StoreReadyLoading';

const Home = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    proxyStore.ready().then(() => {
      setIsStoreReady(true);
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

export default Home;
