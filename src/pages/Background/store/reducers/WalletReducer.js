import { SET_WALLET_DATA } from '../types';

const initialState = {
  isLocked: true,
  isInitialized: false,
};

const WalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET_DATA: {
      return {
        ...state,
        isLocked:
          typeof action.payload.isLocked === 'boolean'
            ? action.payload.isLocked
            : true,
        isInitialized:
          typeof action.payload.isInitialized == 'boolean'
            ? action.payload.isInitialized
            : false,
      };
    }
    default: {
      return state;
    }
  }
};

export default WalletReducer;
