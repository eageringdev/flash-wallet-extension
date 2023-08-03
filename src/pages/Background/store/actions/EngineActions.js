import { ethers } from 'ethers';

import { SET_FEE_DATA, SET_GETTING_FEE_DATA_TIMER_ID } from '../types';

import { feeRatio } from '../../../App/engine/constants';

export const getFeeData = (dispatch, currentNetworkObject) => {
  const provider = new ethers.providers.JsonRpcProvider(
    currentNetworkObject.rpc
  );

  if (currentNetworkObject.chainType === 'ethereum') {
    provider.getFeeData().then((feeData) => {
      const lowFeeData = {
        maxFeePerGas: ethers.BigNumber.from(
          (feeData.maxFeePerGas * feeRatio.lowFeeRatio).toFixed(0)
        ),
        maxPriorityFeePerGas: ethers.BigNumber.from(
          (feeData.maxPriorityFeePerGas * feeRatio.lowFeeRatio).toFixed(0)
        ),
      };
      const mediumFeeData = {
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      };
      const highFeeData = {
        maxFeePerGas: ethers.BigNumber.from(
          (feeData.maxFeePerGas * feeRatio.highFeeRatio).toFixed(0)
        ),
        maxPriorityFeePerGas: ethers.BigNumber.from(
          (feeData.maxPriorityFeePerGas * feeRatio.highFeeRatio).toFixed(0)
        ),
      };
      dispatch({
        type: SET_FEE_DATA,
        payload: {
          low: lowFeeData,
          medium: mediumFeeData,
          high: highFeeData,
        },
      });
    });
  } else if (currentNetworkObject.chainType === 'binance') {
    provider.getFeeData().then((feeData) => {
      console.log(
        ethers.BigNumber.from(
          (feeData.gasPrice * feeRatio.lowFeeRatio).toFixed(0)
        ).toJSON()
      );
      const lowFeeData = {
        gasPrice: ethers.BigNumber.from(
          (feeData.gasPrice * feeRatio.lowFeeRatio).toFixed(0)
        ),
      };
      const mediumFeeData = {
        gasPrice: feeData.gasPrice,
      };
      const highFeeData = {
        gasPrice: ethers.BigNumber.from(
          (feeData.gasPrice * feeRatio.highFeeRatio).toFixed(0)
        ),
      };
      dispatch({
        type: SET_FEE_DATA,
        payload: {
          low: lowFeeData,
          medium: mediumFeeData,
          high: highFeeData,
        },
      });
    });
  }
};

export const setGettingFeeDataTimerId = (dispacth, timerId) => {
  dispacth({ type: SET_GETTING_FEE_DATA_TIMER_ID, payload: timerId });
};
