import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

//import routes
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';

import browser from 'webextension-polyfill';

//import actions
import { setWalletData } from '../../Background/store/actions/WalletActions';
import { loadAccountsDataFromStorage } from '../../Background/store/actions/AccountsActions';
import { loadNetworksDataFromStorage } from '../../Background/store/actions/NetworkActions';
import { loadSettingsDataFromStorage } from '../../Background/store/actions/SettingsActions';
import { loadTokensDataFromStorage } from '../../Background/store/actions/TokensActions';
import { loadNftBalancesInfoFromStorage } from '../../Background/store/actions/NftBalanceActions';
import { loadDeadFunctionInfoFromStorage } from '../../Background/store/actions/DeadFunctionActions';

//import router guards
import CheckInitializationRoute from '../components/CheckInitializationRoute';
import CheckLockRoute from '../components/CheckLockRoute';
import OnlyInitializationRoutes from '../components/OnlyInitializationRoutes';

//import screens
import LoadingScreen from '../components/LoadingScreen';

import Initialize from '../screens/Initialize';
import ImportWallet from '../screens/ImportWallet';

// create wallet screens
import CreatePassword from '../screens/CreateWallet/CreatePassword';
import SecureWallet from '../screens/CreateWallet/SecureWallet';
import SecureSeed from '../screens/CreateWallet/SecureSeed';
import WriteSeed from '../screens/CreateWallet/WriteSeed';
import CheckSeed from '../screens/CreateWallet/CheckSeed';
import Final from '../screens/CreateWallet/Final';

import Login from '../screens/Login';
import MainScreen from '../screens/MainScreen';
import WalletScreen from '../screens/WalletScreen';
import SwapScreen from '../screens/SwapScreen';
import TokenShow from '../screens/WalletScreen/TokenShow';
import AddTokenScreen from '../screens/AddTokenScreen';
import SendTokenScreen from '../screens/SendTokenScreen';
import SettingScreen from '../screens/SettingScreen';

const MainRouter = ({
  setWalletData,
  loadAccountsDataFromStorage,
  loadNetworksDataFromStorage,
  loadSettingsDataFromStorage,
  loadTokensDataFromStorage,
  loadNftBalancesInfoFromStorage,
  loadDeadFunctionInfoFromStorage,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Main Router here');
    setLoading(true);
    loadAccountsDataFromStorage();
    loadNetworksDataFromStorage();
    loadSettingsDataFromStorage();
    loadTokensDataFromStorage();
    loadNftBalancesInfoFromStorage();
    loadDeadFunctionInfoFromStorage();
    browser.storage.sync.get(['wallets_info']).then((data) => {
      setWalletData(data.wallets_info || {});
      setLoading(false);
      // browser.storage.local.get('lastOpenTime').then(data => {
      //   if (data.lastOpenTime && Date.now() - data.lastOpenTime > 30000) {

      //   }
      // })
    });
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <HashRouter>
          <Routes>
            <Route path="" element={<Navigate to={'/login'} replace />} />
            <Route path="/initialize" element={<OnlyInitializationRoutes />}>
              <Route path="" element={<Navigate to={'property-diversity'} />} />
              <Route
                path="property-diversity"
                element={<Initialize step={0} />}
              />
              <Route
                path="safe-and-convenient"
                element={<Initialize step={1} />}
              />
              <Route
                path="convenient-transaction"
                element={<Initialize step={2} />}
              />
              <Route path="wallet-setup" element={<Initialize step={3} />} />
              <Route
                path="*"
                element={<Navigate to={'property-diversity'} />}
              />
            </Route>
            <Route path="/import-wallet" element={<ImportWallet />} />
            <Route path="/create-wallet" element={<OnlyInitializationRoutes />}>
              <Route path="" element={<Navigate to={'create-password'} />} />
              <Route path="create-password" element={<CreatePassword />} />
              <Route path="secure-wallet" element={<SecureWallet />} />
              <Route path="secure-seed" element={<SecureSeed />} />
              <Route path="write-seed" element={<WriteSeed />} />
              <Route path="check-seed" element={<CheckSeed />} />
              <Route path="final" element={<Final />} />
              <Route path="*" element={<Navigate to={'create-password'} />} />
            </Route>
            <Route
              path="/login"
              element={
                <CheckInitializationRoute>
                  <Login />
                </CheckInitializationRoute>
              }
            />
            <Route
              path="/main"
              element={
                <CheckLockRoute>
                  <MainScreen />
                </CheckLockRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <CheckLockRoute>
                  <WalletScreen />
                </CheckLockRoute>
              }
            />
            <Route
              path="/swap"
              element={
                <CheckLockRoute>
                  <SwapScreen />
                </CheckLockRoute>
              }
            />
            <Route
              path="/token-show"
              element={
                <CheckLockRoute>
                  <TokenShow />
                </CheckLockRoute>
              }
            />
            <Route
              path="/add-token"
              element={
                <CheckLockRoute>
                  <AddTokenScreen />
                </CheckLockRoute>
              }
            />
            <Route
              path="/send-token"
              element={
                <CheckLockRoute>
                  <SendTokenScreen />
                </CheckLockRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <CheckLockRoute>
                  <SettingScreen />
                </CheckLockRoute>
              }
            />
            <Route path="*" element={<Navigate to={'/login'} replace />} />
          </Routes>
        </HashRouter>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setWalletData: (data) => setWalletData(dispatch, data),
  loadAccountsDataFromStorage: () => loadAccountsDataFromStorage(dispatch),
  loadNetworksDataFromStorage: () => loadNetworksDataFromStorage(dispatch),
  loadSettingsDataFromStorage: () => loadSettingsDataFromStorage(dispatch),
  loadTokensDataFromStorage: () => loadTokensDataFromStorage(dispatch),
  loadNftBalancesInfoFromStorage: () =>
    loadNftBalancesInfoFromStorage(dispatch),
  loadDeadFunctionInfoFromStorage: () =>
    loadDeadFunctionInfoFromStorage(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainRouter);
