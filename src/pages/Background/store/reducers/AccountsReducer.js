import {
  SET_ACCOUNTS_DATA,
  SET_CURRENT_ACCOUNT_INDEX,
  SET_INITIAL_ACCOUNT_DATA,
} from '../types';

const initialState = {
  accounts: [],
  currentAccountIndex: -1,
};

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INITIAL_ACCOUNT_DATA: {
      console.log('Account Action: ', SET_INITIAL_ACCOUNT_DATA);
      return {
        ...state,
        accounts: [action.payload],
        currentAccountIndex: 0,
      };
    }
    case SET_ACCOUNTS_DATA: {
      return {
        ...state,
        accounts: [].concat(action.payload?.accounts || state.accounts),
        currentAccountIndex: action.payload?.currentAccountIndex || 0,
      };
    }
    case SET_CURRENT_ACCOUNT_INDEX: {
      return {
        ...state,
        currentAccountIndex: parseInt(action.payload),
      };
    }
    default: {
      return state;
    }
  }
};

export default AccountsReducer;
