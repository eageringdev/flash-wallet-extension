import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ethers, utils } from 'ethers';

//import actions
import { sendTransaction } from '../../../../Background/store/actions/TransactionActions';
import { setCurrentAccountIndex } from '../../../../Background/store/actions/AccountsActions';
import {
  getFeeData,
  setGettingFeeDataTimerId,
} from '../../../../Background/store/actions/EngineActions';

//import engine
import {
  transferETHGasLimit,
  gettingFeeDataTimerInterval,
} from '../../../../App/engine/constants';

//import utils
import { isValidAddress } from '../../../utils/common';
import { getEstimatedGasLimit } from '../../../utils/gas';

//import components
import BalanceText from '../../../components/BalanceText';
import TokenBalanceText from '../../../components/TokenBalanceText';
import SingleInput from '../../../components/CustomInputs/SingleInput';
import { PrimaryButton } from '../../../components/Buttons';
import CanSendTokenList from '../../../components/CanSendTokenList';
import GradientText from '../../../components/GradientText';
import { NetworkFeeEthereumModal } from '../../../components/NetworkFeeModal';

//import mui
import { Avatar, Box, Button, Modal, IconButton, Divider } from '@mui/material';
import {
  CheckCircle,
  Clear,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';

import { useSnackbar } from 'notistack';

//import styles
import { colors, fonts } from '../../../styles';
import Constants from '../../../constants';
import { modalStyle } from '../../../styles/mui/muiStyles';

const avatars = Constants.avatars;
const avatarsCount = Constants.avatarsCount;

const SendTokenEthereum = ({
  accounts,
  currentAccountIndex,
  currentSelectedToken,
  balancesInfo,
  networks,
  currentNetwork,
  sendTransaction,
  setCurrentAccountIndex,
  feeData,
  getFeeData,
  gettingFeeDataTimerId,
  setGettingFeeDataTimerId,
  onSubmitTxn,
  onErrorOccured,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [showAccountListModal, setShowAccountListModal] = useState(false);
  const [showNetworkFeeModal, setShowNetworkFeeModal] = useState(false);

  const [sendAddress, setSendAddress] = useState('');
  const [status, setStatus] = useState('default');
  const [selectedToken, setSelectedToken] = useState(
    currentSelectedToken ? currentSelectedToken : 'main'
  );
  const [sendValue, setSendValue] = useState('');
  const [gasLimit, setGasLimit] = useState('');
  const [error, setError] = useState('');
  const [foundAccount, setFoundAccount] = useState(undefined);
  const [amountLoading, setAmountLoading] = useState(false);
  const [sendTransactionLoading, setSendTransactionLoading] = useState(false);
  const [showMyAccounts, setShowMyAccounts] = useState(false);
  const [maxPriorityFee, setMaxPriorityFee] = useState(
    feeData.medium
      ? feeData.medium.maxPriorityFeePerGas
      : ethers.BigNumber.from(0)
  );
  const [maxFee, setMaxFee] = useState(
    feeData.medium ? feeData.medium.maxFeePerGas : ethers.BigNumber.from(0)
  );
  const [networkFeeType, setNetworkFeeType] = useState('medium');
  const [sendTxnError, setSendTxnError] = useState('');

  const currentAccount = accounts[currentAccountIndex];
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log("...get Fee Data from 'sendToken");
      getFeeData(networks[currentNetwork]);
    }, gettingFeeDataTimerInterval);
    setGettingFeeDataTimerId(timerId);
    return () => {
      console.log('bybye sendToken');
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if (!feeData.low || !feeData.low.maxFeePerGas) {
      return;
    }
    if (networkFeeType !== 'advanced') {
      if (networkFeeType === 'low') {
        if (feeData.low.maxFeePerGas.toString() !== maxFee.toString()) {
          setMaxFee(feeData.low.maxFeePerGas);
        }
        if (
          feeData.low.maxPriorityFeePerGas.toString() !==
          maxPriorityFee.toString()
        ) {
          setMaxPriorityFee(feeData.low.maxPriorityFeePerGas);
        }
      } else if (networkFeeType === 'medium') {
        if (feeData.medium.maxFeePerGas.toString() !== maxFee.toString()) {
          setMaxFee(feeData.medium.maxFeePerGas);
        }
        if (
          feeData.medium.maxPriorityFeePerGas.toString() !==
          maxPriorityFee.toString()
        ) {
          setMaxPriorityFee(feeData.medium.maxPriorityFeePerGas);
        }
      } else if (networkFeeType === 'high') {
        if (feeData.high.maxFeePerGas.toString() !== maxFee.toString()) {
          setMaxFee(feeData.high.maxFeePerGas);
        }
        if (
          feeData.high.maxPriorityFeePerGas.toString() !==
          maxPriorityFee.toString()
        ) {
          setMaxPriorityFee(feeData.high.maxPriorityFeePerGas);
        }
      }
    }
  }, [feeData, networkFeeType]);

  const getSendingEtherGasFee = () => {
    return (
      parseFloat(utils.formatEther(feeData.high.maxFeePerGas)) *
      transferETHGasLimit
    );
  };

  const findAccountNameFromAddress = (address) => {
    const foundIndex = accounts.findIndex(
      (item) => item.address.toString() === address.toString()
    );
    if (foundIndex >= 0) {
      setFoundAccount({ ...accounts[foundIndex] });
    } else {
      setFoundAccount(undefined);
    }
  };

  const onAmountConfirm = () => {
    if (!(Number(sendValue) === parseFloat(sendValue))) {
      setError('Invalid Amount');
      return;
    }
    const curBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address][
          selectedToken === 'main' ? 'main' : selectedToken.tokenAddress
        ]
        ? parseFloat(
            balancesInfo[currentAccount.address][
              selectedToken === 'main' ? 'main' : selectedToken.tokenAddress
            ]
          )
        : 0
      : 0;
    if (selectedToken === 'main') {
      if (
        parseFloat(curBalance) <
        getSendingEtherGasFee() + parseFloat(sendValue)
      ) {
        setError('Insufficient Funds');
      } else {
        setGasLimit(transferETHGasLimit);
        setStatus('confirm');
      }
      return;
    }
    if (parseFloat(curBalance) < parseFloat(sendValue)) {
      setError('Insufficient Funds');
      return;
    }
    const mainBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address]['main']
      : 0;
    setAmountLoading(true);
    clearTimeout(gettingFeeDataTimerId);
    getEstimatedGasLimit(
      currentAccount.privateKey,
      networks[currentNetwork].rpc,
      sendValue,
      sendAddress,
      selectedToken
    )
      .then((res) => {
        if (parseFloat(mainBalance) < res * utils.formatEther(maxFee)) {
          setError('Insufficient ETH to send token');
          setAmountLoading(false);
        } else {
          setAmountLoading(false);
          setGasLimit(res);
          setStatus('confirm');
        }
        const timerId = setInterval(() => {
          console.log('...get fee data from sedToken');
          getFeeData(networks[currentNetwork]);
        }, gettingFeeDataTimerInterval);
        setGettingFeeDataTimerId(timerId);
      })
      .catch((err) => {
        setError('Cannot send (maybe insufficient ETH to send token)');
        setAmountLoading(false);
        const timerId = setInterval(() => {
          console.log('...get fee data from sendToken');
          getFeeData(networks[currentNetwork]);
        }, gettingFeeDataTimerInterval);
        setGettingFeeDataTimerId(timerId);
      });
  };

  const onSendTransaction = () => {
    const mainBalance = balancesInfo[currentAccount.address]
      ? balancesInfo[currentAccount.address]['main']
      : 0;
    const totalGasFee = parseFloat(utils.formatEther(maxFee)) * gasLimit;
    if (selectedToken === 'main') {
      const totalAmount = parseFloat(sendValue) + totalGasFee;
      if (totalAmount > mainBalance) {
        setSendTxnError('Not enough ETH to send this transaction.');
        return;
      }
    } else {
      if (totalGasFee > mainBalance) {
        setSendTxnError('Not enough ETH to send this transaction.');
        return;
      }
    }
    if (sendTxnError.length > 0) {
      setSendTxnError('');
    }
    clearTimeout(gettingFeeDataTimerId);
    sendTransaction(
      {
        currentNetworkRPC: networks[currentNetwork].rpc,
        fromPrivateKey: currentAccount.privateKey,
        toAddress: sendAddress,
        value: sendValue,
        token: selectedToken,
        feeInfo: {
          maxFeePerGas: maxFee,
          maxPriorityFeePerGas: maxPriorityFee,
          gasLimit: ethers.BigNumber.from(gasLimit),
        },
      },
      () => {
        setSendTransactionLoading(true);
      },
      (originTxn) => {
        console.log(originTxn);
        setSendTransactionLoading(false);
        enqueueSnackbar('Transaction ' + '#' + originTxn.nonce + ' Submitted', {
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
        setSendTransactionLoading(false);
        // onErrorOccured(error);
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
      },
      enqueueSnackbar
    );
  };

  const renderAccountRow = ({
    accountName,
    accountAddress,
    accountIcon,
    onClick,
    selected,
    hasKey,
  }) => {
    return (
      <Button
        className="w-100"
        onClick={onClick}
        key={
          typeof hasKey === 'boolean' && hasKey === true
            ? 'renderAccountRowinsendtoken_' + accountAddress
            : Math.random().toString()
        }
      >
        <div className="d-flex flex-row align-items-center w-100">
          <div className="d-flex flex-row align-items-center text-left w-100">
            <div
              className="mr-2"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: colors.grey23,
              }}
            >
              <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                {accountIcon}
              </div>
            </div>
            <div>
              <div
                className="text-white font-weight-bold"
                style={
                  {
                    // ...fonts.title2,
                  }
                }
              >
                {accountName}
              </div>
              <div
                style={{
                  // ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                {accountAddress.slice(0, 6) + '...' + accountAddress.slice(-4)}
              </div>
            </div>
            {selected && (
              <div className="flex-fill d-flex flex-row-reverse">
                <CheckCircle
                  style={{ fontSize: '20px', color: colors.green5 }}
                />
              </div>
            )}
          </div>
        </div>
      </Button>
    );
  };

  const renderAccountsListModal = () => {
    return (
      <Modal
        open={showAccountListModal}
        onClose={() => {
          setShowAccountListModal(false);
        }}
        aria-labelledby="account-list-modal-title"
        aria-describedby="account-list-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="account-list-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Accounts
            </h6>
          </div>
          <div
            id="account-list-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            {accounts.map((account) => {
              return renderAccountRow({
                accountName: account.name,
                accountAddress: account.address,
                accountIcon: (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      backgroundColor: colors.grey23,
                    }}
                  >
                    <div
                      style={{ position: 'relative', left: '0px', top: '0px' }}
                    >
                      <Avatar
                        variant="rounded"
                        style={{ width: '24px', height: '24px' }}
                        src={avatars[account.icon]}
                      />
                    </div>
                  </div>
                ),
                onClick: () => {
                  setCurrentAccountIndex(account.index);
                  setShowAccountListModal(false);
                },
                selected: account.index === currentAccountIndex,
                hasKey: true,
              });
            })}
          </div>
        </Box>
      </Modal>
    );
  };

  const renderFromAccountPanel = ({ canSelect }) => {
    return (
      <div
        className="mt-2 mr-2 ml-2"
        style={{ marginTop: 24, marginHorizontal: 24 }}
      >
        <div
          className="text-white font-weight-bold"
          style={
            {
              // ...fonts.title2
            }
          }
        >
          From
        </div>
        <Button
          onClick={
            canSelect
              ? () => {
                  setShowAccountListModal(true);
                }
              : () => {}
          }
          className="pl-2 pr-2 w-100"
        >
          <div className="d-flex w-100 flex-row align-items-center">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: colors.grey23,
              }}
            >
              <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                <Avatar
                  variant="rounded"
                  style={{ width: '24px', height: '24px' }}
                  src={avatars[currentAccount.icon]}
                />
              </div>
            </div>
            <div className="d-flex ml-2 align-items-center flex-fill">
              <div
                className="text-white font-weight-bold text-left"
                style={
                  {
                    // ...fonts.title2,
                  }
                }
              >
                {currentAccount.name}
                <div
                  className="font-weight-normal d-flex flex-row align-items-center"
                  style={{
                    // ...fonts.caption_small12_18_regular,
                    color: colors.grey9,
                  }}
                >
                  Balance:
                  {selectedToken === 'main' ? (
                    <BalanceText
                      className="ml-1"
                      style={{
                        // ...fonts.caption_small12_18_regular,
                        color: colors.grey9,
                      }}
                      address={currentAccount.address}
                    />
                  ) : (
                    <TokenBalanceText
                      className="ml-1"
                      address={currentAccount.address}
                      token={selectedToken}
                      style={{
                        // ...fonts.caption_small12_18_regular,
                        color: colors.grey9,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            {canSelect && (
              <div className="mr-2">
                <KeyboardArrowRight
                  style={{ fontSize: '16px', color: 'white' }}
                />
              </div>
            )}
          </div>
        </Button>
      </div>
    );
  };

  const renderRecentAccountsPanel = () => {
    return (
      <div className="mt-2 mr-2 ml-2">
        <div
          className="font-weight-bold"
          style={{
            // ...fonts.title2,
            color: colors.grey9,
          }}
        >
          Recent
        </div>
        <div className="mt-2">
          {renderAccountRow({
            accountName: 'Beexay',
            accountAddress: '0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996',
            accountIcon: (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: colors.grey23,
                }}
              >
                <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                  <Avatar
                    variant="rounded"
                    style={{ width: '24px', height: '24px' }}
                    src={avatars[0]}
                  />
                </div>
              </div>
            ),
            onClick: () => {},
          })}
          {renderAccountRow({
            accountName: 'Dasun Bussi',
            accountAddress: '0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996',
            accountIcon: (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: colors.grey23,
                }}
              >
                <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                  <Avatar
                    variant="rounded"
                    style={{ width: '24px', height: '24px' }}
                    src={avatars[1]}
                  />
                </div>
              </div>
            ),
            onClick: () => {},
          })}
          {renderAccountRow({
            accountName: 'Smart Gevan',
            accountAddress: '0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996',
            accountIcon: (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: colors.grey23,
                }}
              >
                <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                  <Avatar
                    variant="rounded"
                    style={{ width: '24px', height: '24px' }}
                    src={avatars[2]}
                  />
                </div>
              </div>
            ),
            onClick: () => {},
          })}
        </div>
      </div>
    );
  };

  const renderDefaultStatus = () => {
    return (
      <div className="h-100 d-flex flex-column">
        <div className="flex-fill">
          <div className="d-flex flex-row align-items-center">
            <div
              className="flex-fill text-white text-center"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Send to
            </div>
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              className="mr-2"
            >
              <Clear className="text-white" style={{ fontSize: '18px' }} />
            </IconButton>
          </div>
          {renderFromAccountPanel({ canSelect: true })}
          <div className="mt-2 ml-2 mr-2">
            <div
              className="text-white font-weight-bold"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              To
            </div>
            {isValidAddress(sendAddress) ? (
              <div className="d-flex flex-row align-items-center">
                {renderAccountRow({
                  accountName: foundAccount ? foundAccount.name : 'Unknown',
                  accountAddress: sendAddress,
                  accountIcon: (
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '20px',
                        backgroundColor: colors.grey23,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          left: '0px',
                          top: '0px',
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          style={{ width: '24px', height: '24px' }}
                          src={avatars[foundAccount ? foundAccount.icon : 0]}
                        />
                      </div>
                    </div>
                  ),
                })}
                <IconButton
                  onClick={() => {
                    setSendAddress('');
                    setFoundAccount(undefined);
                    setShowMyAccounts(false);
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  className="d-flex flex-fill flex-row-reverse mr-2"
                >
                  <Clear className="text-white" style={{ fontSize: '18px' }} />
                </IconButton>
              </div>
            ) : (
              <>
                <SingleInput
                  label="Public Address"
                  className="mt-2"
                  value={sendAddress}
                  onChangeValue={(value) => {
                    setSendAddress(value);
                    if (isValidAddress(value)) {
                      findAccountNameFromAddress(value);
                    } else {
                      setFoundAccount(undefined);
                    }
                  }}
                />
                {foundAccount != undefined && (
                  <div
                    className="ml-1"
                    style={{
                      color: colors.primary5,
                      // ...fonts.para_regular,
                    }}
                  >
                    {foundAccount.name}
                  </div>
                )}
              </>
            )}
          </div>
          {isValidAddress(sendAddress) ? (
            <></>
          ) : (
            <>
              {!showMyAccounts ? (
                <Button
                  className="mt-2"
                  onClick={() => {
                    setShowMyAccounts(true);
                  }}
                >
                  <div
                    style={{
                      // ...fonts.btn_medium_link,
                      textDecoration: 'underline',
                      color: colors.blue5,
                    }}
                  >
                    Transfer Between My Accounts
                  </div>
                </Button>
              ) : (
                <div className="mt-2 ml-2 mr-2">
                  {accounts.map((account) =>
                    renderAccountRow({
                      accountName: account.name,
                      accountAddress: account.address,
                      accountIcon: (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '20px',
                            backgroundColor: colors.grey23,
                          }}
                        >
                          <div
                            style={{
                              position: 'relative',
                              left: '0px',
                              top: '0px',
                            }}
                          >
                            <Avatar
                              variant="rounded"
                              style={{ width: '24px', height: '24px' }}
                              src={avatars[account.icon]}
                            />
                          </div>
                        </div>
                      ),
                      onClick: () => {
                        setSendAddress(account.address);
                        setFoundAccount(account);
                      },
                    })
                  )}
                </div>
              )}
              {renderRecentAccountsPanel()}
            </>
          )}
        </div>
        <div className="ml-2 mr-2 mt-2 pb-2">
          <PrimaryButton
            onClick={() => {
              setStatus('selected');
            }}
            text="Next"
            enableFlag={isValidAddress(sendAddress)}
          />
        </div>
      </div>
    );
  };

  const renderSelectedStatus = () => {
    return (
      <div className="h-100 d-flex flex-column">
        <div className="d-flex flex-row align-items-center">
          <IconButton
            className="ml-1"
            onClick={() => {
              setStatus('default');
              setSendAddress('');
              setFoundAccount(undefined);
              setShowMyAccounts(false);
              setError('');
              setSendValue('');
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <KeyboardArrowLeft
              className="mr-2"
              style={{ fontSize: '16px', color: 'white' }}
            />
          </IconButton>
          <div
            className="flex-fill text-white text-center"
            style={{
              // ...fonts.title2,
              fontWeight: 'bole',
            }}
          >
            Amount
          </div>
          <IconButton
            className="ml-1"
            onClick={() => {
              navigate(-1);
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <Clear
              className="mr-2"
              style={{ fontSize: '16px', color: 'white' }}
            />
          </IconButton>
        </div>

        <div className="mt-4 mr-1 d-flex flex-row align-items-center">
          <div className="w-100 align-items-center">
            <CanSendTokenList
              className="w-50"
              selectedToken={selectedToken}
              onSelectToken={(token) => {
                setSelectedToken(token);
                setSendValue('');
              }}
            />
          </div>
          <Button
            disabled={!(feeData.high && feeData.high.maxFeePerGas)}
            style={{ position: 'absolute', right: '12px' }}
            onClick={() => {
              const curBalance = balancesInfo[currentAccount.address]
                ? balancesInfo[currentAccount.address][
                    selectedToken === 'main'
                      ? 'main'
                      : selectedToken.tokenAddress
                  ]
                  ? parseFloat(
                      balancesInfo[currentAccount.address][
                        selectedToken === 'main'
                          ? 'main'
                          : selectedToken.tokenAddress
                      ]
                    )
                  : 0
                : 0;
              const tempSendValueText = Math.max(
                parseFloat(
                  selectedToken === 'main'
                    ? curBalance - getSendingEtherGasFee()
                    : curBalance
                ),
                0
              ).toString();
              setSendValue(tempSendValueText.slice(0, -1));
            }}
          >
            <div
              className="font-weight-bold"
              style={{
                // ...fonts.btn_medium_normal,
                color: !(feeData.high && feeData.high.maxFeePerGas)
                  ? colors.grey9
                  : colors.primary5,
              }}
            >
              Use Max
            </div>
          </Button>
        </div>

        <div className="mt-4 d-flex flex-row align-items-center justify-content-center ml-2 mr-2">
          <SingleInput
            label="Sending Amount"
            value={sendValue}
            onChangeValue={(value) => {
              setSendValue(value);
              setError('');
            }}
          />
        </div>
        {error.length > 0 && (
          <div
            className="text-center mt-2"
            style={{
              // ...fonts.para_regular,
              color: colors.red5,
            }}
          >
            {error}
          </div>
        )}
        <div className="mt-4 d-flex flex-row align-items-center mb-4 justify-content-center">
          <div className="text-white mr-1">Balance:</div>
          {selectedToken === 'main' ? (
            <BalanceText
              className="text-center text-white"
              address={currentAccount.address}
              style={
                {
                  // ...fonts.para_regular,
                }
              }
            />
          ) : (
            <TokenBalanceText
              address={currentAccount.address}
              className="text-white text-center"
              style={
                {
                  // ...fonts.para_regular,
                }
              }
              token={selectedToken}
            />
          )}
        </div>
        <div className="d-flex flex-column-reverse flex-fill ml-2 mr-2 pb-2">
          <PrimaryButton
            loading={amountLoading}
            onClick={onAmountConfirm}
            text="Next"
            enableFlag={sendValue.length > 0}
          />
        </div>
      </div>
    );
  };

  const renderNetworkFeeModal = () => {
    return (
      <Modal
        open={showNetworkFeeModal}
        onClose={() => {
          setShowNetworkFeeModal(false);
        }}
        aria-describedby="network-fee-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="network-fee-modal-description" sx={{ mt: 4 }}>
            <NetworkFeeEthereumModal
              networkFeeType={networkFeeType}
              maxFee={maxFee}
              maxPriorityFee={maxPriorityFee}
              gasLimit={gasLimit}
              onSave={({ type, data }) => {
                if (type !== 'advanced') {
                  setNetworkFeeType(type);
                  setMaxFee(feeData[type].maxFeePerGas);
                  setMaxPriorityFee(feeData[type].maxPriorityFeePerGas);
                  setGasLimit(parseInt(data.gasLimit));
                } else {
                  setNetworkFeeType('advanced');
                  setMaxFee(utils.parseUnits(data.maxFee, 'gwei'));
                  setMaxPriorityFee(
                    utils.parseUnits(data.maxPriorityFee, 'gwei')
                  );
                  setGasLimit(parseInt(data.gasLimit));
                }
                setShowNetworkFeeModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const renderConfirmStatus = () => {
    const totalGasFee = parseFloat(utils.formatEther(maxFee)) * gasLimit;
    return (
      <div className="h-100 d-flex flex-column">
        {/* {renderNetworkFeeRBSheet()} */}
        <div className="d-flex flex-row align-items-center ml-1 mr-1">
          <IconButton
            onClick={() => {
              setStatus('selected');
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <KeyboardArrowLeft style={{ fontSize: '16px', color: 'white' }} />
          </IconButton>
          <div
            className="text-white text-center font-weight-bold flex-fill"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            Confirm
          </div>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <Clear style={{ fontSize: '16px', color: 'white' }} />
          </IconButton>
        </div>
        <div
          className="mt-3 text-center text-white"
          style={
            {
              // ...fonts.para_regular,
            }
          }
        >
          Amount
        </div>
        <div className="mt-2">
          <GradientText fontSize={'30px'} className="text-center">
            {selectedToken === 'main'
              ? sendValue + ' ' + currentNetworkSymbol
              : sendValue + ' ' + selectedToken.tokenSymbol}
          </GradientText>
        </div>
        {renderFromAccountPanel({ canSelect: false })}
        <div className="mt-2 mr-2 ml-2">
          <div
            className="text-white font-weight-bold"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            To
          </div>
          {renderAccountRow({
            accountName: foundAccount ? foundAccount.name : 'Unknown',
            accountAddress: sendAddress,
            accountIcon: (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: colors.grey23,
                }}
              >
                <div style={{ position: 'relative', left: '0px', top: '0px' }}>
                  <Avatar
                    variant="rounded"
                    style={{ width: '24px', height: '24px' }}
                    src={avatars[foundAccount ? foundAccount.icon : 0]}
                  />
                </div>
              </div>
            ),
          })}
        </div>
        <div className="mt-4 p-2 ml-2 mr-2">
          <div className="d-flex flex-row align-items-center">
            <div
              className="text-white flex-fill text-left"
              style={
                {
                  // ...fonts.para_regular
                }
              }
            >
              Amount
            </div>
            <div
              className="text-white"
              style={
                {
                  // ...fonts.para_regular
                }
              }
            >
              {sendValue +
                ' ' +
                (selectedToken === 'main'
                  ? '' + currentNetworkSymbol
                  : selectedToken.tokenSymbol)}
            </div>
          </div>
          <div className="mt-1 d-flex flex-row align-items-center">
            <div className="d-flex flex-row align-items-center flex-fill text-left">
              <div
                className="text-white"
                style={
                  {
                    // ...fonts.para_regular,
                  }
                }
              >
                Network Fee
              </div>
              <Button
                onClick={() => {
                  setShowNetworkFeeModal(true);
                }}
              >
                <div
                  className="font-weight-bold"
                  style={{
                    // ...fonts.para_semibold,
                    color: colors.primary5,
                  }}
                >
                  Edit
                </div>
              </Button>
            </div>
            <div
              className="text-white text-right"
              style={
                {
                  // ...fonts.para_regular
                }
              }
            >
              {totalGasFee + ' ' + currentNetworkSymbol}
            </div>
          </div>
        </div>
        <Divider style={{ backgroundColor: colors.grey9 }} />
        <div className="ml-2 mr-2 p-2 d-flex flex-row">
          <div
            className="flex-fill text-white text-left font-weight-bold"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            Total Amount
          </div>
          <div
            className="text-white font-weight-bold text-right ml-2"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            {selectedToken === 'main'
              ? (parseFloat(sendValue) + totalGasFee).toString() +
                ' ' +
                currentNetworkSymbol
              : sendValue +
                ' ' +
                selectedToken.tokenSymbol +
                ' + ' +
                totalGasFee +
                ' ' +
                currentNetworkSymbol}
          </div>
        </div>
        {sendTxnError.length > 0 && (
          <div
            className="ml-4 mt-1"
            style={{
              // ...fonts.caption_small12_16_regular,
              color: colors.red5,
            }}
          >
            {sendTxnError}
          </div>
        )}
        <div className="flex-fill d-flex flex-column-reverse pb-3 ml-2 mr-2">
          <PrimaryButton
            onClick={() => {
              onSendTransaction();
            }}
            loading={sendTransactionLoading}
            text="Send"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-100 h-100 display-v-h-center">
      <div className="col-lg-4 col-md-5 col-sm-6 col-xs-8 h-100 d-flex flex-column p-2 pb-4 pt-3">
        {renderAccountsListModal()}
        {renderNetworkFeeModal()}
        {status === 'default' && renderDefaultStatus()}
        {status === 'selected' && renderSelectedStatus()}
        {status === 'confirm' && renderConfirmStatus()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  balancesInfo: state.balances.balancesInfo,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  feeData: state.engine.feeData,
  gettingFeeDataTimerId: state.engine.gettingFeeDataTimerId,
  currentSelectedToken: state.tokens.selectedToken,
});
const mapDispatchToProps = (dispatch) => ({
  sendTransaction: (
    data,
    beforeWork,
    successCallback,
    failCallback,
    enqueueSnackbar
  ) =>
    sendTransaction(
      dispatch,
      data,
      beforeWork,
      successCallback,
      failCallback,
      enqueueSnackbar
    ),
  setCurrentAccountIndex: (index) => setCurrentAccountIndex(dispatch, index),
  getFeeData: (currentNetworkObject) =>
    getFeeData(dispatch, currentNetworkObject),
  setGettingFeeDataTimerId: (timerId) =>
    setGettingFeeDataTimerId(dispatch, timerId),
});
export default connect(mapStateToProps, mapDispatchToProps)(SendTokenEthereum);
