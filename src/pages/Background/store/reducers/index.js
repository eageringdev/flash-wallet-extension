import { combineReducers } from 'redux';

//import reducers
import AccountsReducer from './AccountsReducer';
import WalletReducer from './WalletReducer';
import NetworkReducer from './NetworkReducer';
import BalancesReducer from './BalancesReducer';
import EngineReducer from './EngineReducer';
import SettingsReducer from './SettingsReducer';
import NftBalanceReducer from './NftBalanceReducer';
import NftInfoCacheReducer from './NftInfoCacheReducer';
import TokensReducer from './TokensReducer';
import DeadFunctionReducer from './DeadFunctionReducer';

export default combineReducers({
  accounts: AccountsReducer,
  wallet: WalletReducer,
  networks: NetworkReducer,
  balances: BalancesReducer,
  engine: EngineReducer,
  settings: SettingsReducer,
  tokens: TokensReducer,
  nftBalances: NftBalanceReducer,
  nftInfoCache: NftInfoCacheReducer,
  deadFunction: DeadFunctionReducer,
});
