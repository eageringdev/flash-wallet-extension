import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { utils } from 'ethers';

//import components
import LoadingScreen from '../../../components/LoadingScreen';
import SingleInput from '../../../components/CustomInputs/SingleInput';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import Header from '../Header';
import { SwapConfirmEthereum } from '../SwapConfirm';
import CanSendTokenList from '../../../components/CanSendTokenList';

//import actions
import {
  getFeeData,
  setGettingFeeDataTimerId,
} from '../../../../Background/store/actions/EngineActions';
import { swapToken } from '../../../../Background/store/actions/SwapActions';

//import utils
import { getPriceData } from '../../../utils/swap';
import {
  estimateGasRatio,
  gettingFeeDataTimerInterval,
  minimumEthToSwap,
  swapGasRatio,
  uniswapGasLimit,
} from '../../../engine/constants';

//import mui
import {
  AccountBalanceWallet,
  Refresh,
  Settings,
  SwapHoriz,
  SwapVert,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Button } from '@mui/material';

//import styles
import { colors, fonts } from '../../../styles';

const SwapEthereum = ({
  networks,
  currentNetwork,
  feeData,
  getFeeData,
  setGettingFeeDataTimerId,
  accounts,
  currentAccountIndex,
  balancesInfo,
  swapToken,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [fromToken, setFromToken] = useState('main');
  const [toToken, setToToken] = useState('main');
  const [fromValue, setFromValue] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [canSwap, setCanSwap] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchedPriceData, setFetchedPriceData] = useState('');
  const [status, setStatus] = useState('default');
  const [gasLimit, setGasLimit] = useState('200000');
  const [maxPriorityFee, setMaxPriorityFee] = useState(
    feeData && feeData.medium && feeData.medium.maxPriorityFeePerGas
      ? feeData.medium.maxPriorityFeePerGas
      : undefined
  );
  const [maxFee, setMaxFee] = useState(
    feeData && feeData.medium && feeData.medium.maxFeePerGas
      ? feeData.medium.maxFeePerGas
      : undefined
  );
  const [slippage, setSlippage] = useState('2');
  const [swapLoading, setSwapLoading] = useState(false);

  const currentAccount = accounts[currentAccountIndex];
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  useEffect(() => {
    getFeeData(networks[currentNetwork]);
  }, []);

  useEffect(() => {
    setMaxPriorityFee(
      feeData && feeData.medium && feeData.medium.maxPriorityFeePerGas
        ? feeData.medium.maxPriorityFeePerGas
        : undefined
    );
    setMaxFee(
      feeData && feeData.medium && feeData.medium.maxFeePerGas
        ? feeData.medium.maxFeePerGas
        : undefined
    );
  }, [feeData]);

  const onConfirm = () => {
    const mainBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address]['main']
      : 0;
    const curBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address][
          fromToken === 'main' ? 'main' : fromToken.tokenAddress
        ]
        ? parseFloat(
            balancesInfo[currentAccount.address][
              fromToken === 'main' ? 'main' : fromToken.tokenAddress
            ]
          )
        : 0
      : 0;
    if (fromToken == 'main') {
      if (parseFloat(fromValue) + minimumEthToSwap > curBalance) {
        setConfirmError('Not Enough ' + currentNetworkSymbol);
        return;
      }
    } else {
      if (parseFloat(fromValue) > curBalance) {
        setConfirmError('Not Enough ' + fromToken.tokenSymbol);
        return;
      }
      if (parseFloat(mainBalance) < minimumEthToSwap) {
        setConfirmError('Not Enough ' + currentNetworkSymbol + ' to Swap');
        return;
      }
    }
    setStatus('confirm');
  };

  const onSwap = () => {
    swapToken(
      {
        currentNetwork: networks[currentNetwork],
        currentAccount,
        fromTokenData: fromToken,
        toTokenData: toToken,
        fromValue,
        toValue,
        slippage,
        gasLimit,
        maxPriorityFee,
        maxFee,
      },
      () => {
        setSwapLoading(true);
      },
      (originTxn) => {
        setSwapLoading(false);
        enqueueSnackbar('Swap ' + '#' + originTxn.nonce + ' Submitted', {
          variant: 'warning',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
          },
          anchorOrigin: {
            horizontal: 'center',
            vertical: 'bottom',
          },
        });
        navigate('/wallet');
        // onSubmitTxn(originTxn);
      },
      (error) => {
        setSwapLoading(false);
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
          style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
          },
          anchorOrigin: {
            horizontal: 'center',
            vertical: 'bottom',
          },
        });
        // onErrorOccured(error);
      },
      enqueueSnackbar
    );
  };

  const statusGoBack = (curStatus) => {
    if (curStatus === 'confirm') {
      setStatus('default');
    }
  };

  const getSwapGasFee = () => {
    return (
      parseFloat(utils.formatEther(feeData.high.maxFeePerGas)) *
      uniswapGasLimit *
      swapGasRatio
    );
  };

  const fetchPriceData = (data) => {
    const { fromToken, toToken, fromValue } = data;
    setFetchLoading(true);
    setFetchedPriceData('');
    getPriceData(networks[currentNetwork], fromToken, toToken)
      .then((res) => {
        setFetchLoading(false);
        // console.log('Fetched price::::::', res);
        setFetchedPriceData(res);
      })
      .catch((err) => {
        setFetchLoading(false);
        console.log('Fail Fetch price::::::', err);
        setFetchedPriceData('');
        setCanSwap(false);
      });
  };

  const changeEachToken = () => {
    if (
      (fromToken == 'main' && toToken == 'main') ||
      (fromToken != 'main' &&
        toToken != 'main' &&
        fromToken.tokenAddress == toToken.tokenAddress)
    ) {
      return;
    }
    const temp = fromToken == 'main' ? 'main' : { ...fromToken };
    setFromToken(toToken == 'main' ? 'main' : { ...toToken });
    setToToken(temp);
    fetchPriceData({ fromToken: toToken, toToken: temp });
    setConfirmError('');
  };

  const calcMaxAmount = () => {
    const curBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address][
          fromToken === 'main' ? 'main' : fromToken.tokenAddress
        ]
        ? parseFloat(
            balancesInfo[currentAccount.address][
              fromToken === 'main' ? 'main' : fromToken.tokenAddress
            ]
          )
        : 0
      : 0;
    setFromValue(
      Math.max(
        0,
        parseFloat(
          fromToken === 'main' ? curBalance - getSwapGasFee() : curBalance
        )
      ).toString()
    );
  };

  const checkCanSwap = (data) => {
    const { fromToken, toToken, fromValue } = data;
    if (fromToken == 'main' && toToken == 'main') {
      setCanSwap(false);
      setFetchLoading(false);
      setFetchedPriceData('');
      return;
    }
    if (
      fromToken != 'main' &&
      toToken != 'main' &&
      fromToken.tokenAddress == toToken.tokenAddress
    ) {
      setCanSwap(false);
      setFetchLoading(false);
      setFetchedPriceData('');
      return;
    }
    if (parseFloat(fromValue) != Number(fromValue)) {
      setCanSwap(false);
      setFetchLoading(false);
      setFetchedPriceData('');
      return;
    }
    if (!fetchLoading) {
      fetchPriceData(data);
    }
    if (!canSwap) {
      setCanSwap(true);
    }
  };

  const toValue =
    (fromToken == 'main' && toToken == 'main') ||
    (fromToken != 'main' &&
      toToken != 'main' &&
      fromToken.tokenAddress == toToken.tokenAddress)
      ? fromValue
      : fetchedPriceData.length > 0 &&
        parseFloat(fromValue) === Number(fromValue)
      ? (parseFloat(fromValue) / parseFloat(fetchedPriceData)).toFixed(6)
      : fromValue.length === 0
      ? '0'
      : parseFloat(fromValue) !== Number(fromValue)
      ? 'NaN'
      : '...';

  const renderDefaultStatus = () => {
    return (
      <>
        {/* From panel */}
        <div className="mt-4 pl-2 pr-2">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div
              className="text-white font-weight-bold text-left"
              style={
                {
                  //  ...fonts.title2,
                }
              }
            >
              From
            </div>
            <Button
              onClick={() => {
                calcMaxAmount();
              }}
              style={{
                backgroundColor: colors.grey23,
              }}
            >
              <div
                className="font-weight-bold"
                style={{
                  // ...fonts.btn_medium_normal,
                  color: colors.primary5,
                }}
              >
                Use Max
              </div>
            </Button>
          </div>
          <div className="mt-2 d-flex flex-row align-items-center">
            <CanSendTokenList
              className="mr-3 border-0"
              selectedToken={fromToken}
              onSelectToken={(token) => {
                setFromToken(token);
                checkCanSwap({ toToken, fromToken: token, fromValue });
              }}
            />
            <div className="flex-fill">
              <SingleInput
                label={'From'}
                value={fromValue}
                placeholder={'0'}
                onChangeValue={(value) => {
                  setConfirmError('');
                  setFromValue(value);
                  checkCanSwap({ toToken, fromToken, fromValue: value });
                }}
              />
              <div
                className="text-white"
                style={
                  {
                    //  ...fonts.para_regular,
                  }
                }
              >
                $ 0
              </div>
            </div>
          </div>
        </div>

        {confirmError.length > 0 && (
          <div
            className="ml-3 pt-1 font-weight-bold text-center"
            style={{
              //   ...fonts.para_semibold,
              color: colors.red5,
            }}
          >
            {confirmError}
          </div>
        )}

        {/* Middle panel */}
        <div className="mt-2 mb-2 text-center">
          <IconButton
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              changeEachToken();
            }}
          >
            <SwapVert style={{ color: colors.primary5, fontSize: '32px' }} />
          </IconButton>
        </div>

        {/* To panel */}
        <div className="pl-2 pr-2">
          <div
            className="font-weight-bold text-white"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            To
          </div>
          <div className="mt-2 d-flex flex-row align-items-center">
            <CanSendTokenList
              className="mr-3 border-0"
              selectedToken={toToken}
              onSelectToken={(token) => {
                setToToken(token);
                checkCanSwap({ toToken: token, fromToken, fromValue });
              }}
            />
            <div className="flex-fill">
              <SingleInput
                label={'To'}
                value={toValue}
                editable={false}
                onChangeValue={() => {}}
              />
            </div>
          </div>
          {fetchLoading && (
            <div className="w-100 d-flex flex-row align-items-center justify-content-start mt-1">
              <CircularProgress
                style={{ color: colors.primary5 }}
                size="16px"
              />
              <div
                className="ml-2"
                style={{
                  //   ...fonts.para_regular,
                  color: colors.grey9,
                }}
              >
                Fetching Price Data...
              </div>
            </div>
          )}
          {fetchedPriceData.length > 0 && (
            <div className="w-100 d-flex flex-row align-items-center justify-content-start mt-1">
              <IconButton
                onClick={() => {
                  fetchPriceData({ fromToken, toToken, fromValue });
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                <Refresh style={{ color: colors.primary5, fontSize: '18px' }} />
              </IconButton>
              <div
                className="ml-2"
                style={{
                  //   ...fonts.para_regular,
                  color: colors.grey9,
                }}
              >
                {'1 ' +
                  (toToken == 'main'
                    ? currentNetworkSymbol
                    : toToken.tokenSymbol) +
                  ' = ' +
                  parseFloat(fetchedPriceData).toFixed(4) +
                  ' ' +
                  (fromToken == 'main'
                    ? currentNetworkSymbol
                    : fromToken.tokenSymbol)}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderBottomButtons = () => {
    return (
      <div className="d-flex flex-row align-items-center justify-content-around mt-2">
        <IconButton
          onClick={() => {
            navigate('/wallet');
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <AccountBalanceWallet
                style={{ color: colors.grey9, fontSize: '30px' }}
              />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.grey9,
              }}
            >
              Wallet
            </div>
          </div>
        </IconButton>
        <IconButton
          onClick={() => {}}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <SwapHoriz style={{ color: colors.primary5, fontSize: '30px' }} />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.primary5,
              }}
            >
              Swap
            </div>
          </div>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate('/setting');
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <Settings style={{ color: colors.grey9, fontSize: '30px' }} />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.grey9,
              }}
            >
              Settings
            </div>
          </div>
        </IconButton>
      </div>
    );
  };

  return (
    <>
      {maxFee && maxPriorityFee ? (
        <div className="w-100 h-100 display-v-h-center">
          <div className="col-lg-4 col-md-5 col-sm-6 col-xs-8 h-100 d-flex flex-column p-2 pb-4 pt-3">
            <div
              style={{
                position: 'absolute',
                right: '-15%',
                top: '10%',
                zIndex: -1,
              }}
            >
              <img src={'./assets/images/backimage.png'} />
            </div>
            <div className="flex-fill h-100 d-flex flex-column overflow-auto">
              <Header
                status={status}
                statusGoBack={(status) => statusGoBack(status)}
              />
              {status === 'default' && renderDefaultStatus()}
              {status === 'confirm' && (
                <SwapConfirmEthereum
                  swapData={{
                    fromToken,
                    toToken,
                    fromValue,
                    toValue,
                    inversePrice: fetchedPriceData,
                    slippage,
                  }}
                  setSlippage={(value) => {
                    setSlippage(value);
                  }}
                />
              )}
              <div className="flex-fill d-flex flex-column-reverse pb-3 ml-2 mr-2">
                {status === 'default' && (
                  <PrimaryButton
                    text="Swap"
                    onClick={() => {
                      onConfirm();
                    }}
                    enableFlag={canSwap && !fetchLoading}
                  />
                )}
                {status === 'confirm' && (
                  <PrimaryButton
                    text="Swap"
                    onClick={() => {
                      onSwap();
                    }}
                    loading={swapLoading}
                  />
                )}
              </div>
            </div>
            {renderBottomButtons()}
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  tokens: state.tokens.tokensData,
  feeData: state.engine.feeData,
  gettingFeeDataTimerId: state.engine.gettingFeeDataTimerId,
  balancesInfo: state.balances.balancesInfo,
});
const mapDispatchToProps = (dispatch) => ({
  getFeeData: (currentNetworkObject) =>
    getFeeData(dispatch, currentNetworkObject),
  setGettingFeeDataTimerId: (timerId) =>
    setGettingFeeDataTimerId(dispatch, timerId),
  swapToken: (
    data,
    beforeWork,
    successCallback,
    failCallback,
    enqueueSnackbar
  ) =>
    swapToken(
      dispatch,
      data,
      beforeWork,
      successCallback,
      failCallback,
      enqueueSnackbar
    ),
});
export default connect(mapStateToProps, mapDispatchToProps)(SwapEthereum);
