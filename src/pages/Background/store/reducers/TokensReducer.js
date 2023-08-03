import { SET_SELECTED_TOKEN, SET_TOKENS_DATA } from '../types';

const initialState = {
  tokensData: {},
  selectedToken: '',
};

const TokensReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKENS_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_SELECTED_TOKEN: {
      return {
        ...state,
        selectedToken: action.payload,
      };
    }
    default: {
      // console.log('Token DEFAULT: ', state);
      return state;
    }
  }
};

export default TokensReducer;
