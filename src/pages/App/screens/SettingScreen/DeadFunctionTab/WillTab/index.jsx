import React, { useEffect, useState } from 'react';
import { ethers, utils } from 'ethers';

// import store
import { connect } from 'react-redux';
// import actions
import {
  addWill,
  setWillInfo,
  renounceWill,
} from '../../../../../Background/store/actions/DeadFunctionActions';

// import utils
import { isValidAddress } from '../../../../utils/common';

// import constants
import Constants from '../../../../constants';
import willContractAbi from '../../../../abis/willContractAbi.json';

// import components
import SingleInput from '../../../../components/CustomInputs/SingleInput';
import LoadingScreen from '../../../../components/LoadingScreen';
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';

// import mui
import {
  FormControlLabel,
  RadioGroup,
  FormControl,
  Radio,
  Modal,
  Box,
  FormGroup,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { colors, fonts } from '../../../../styles';
import { willContractAddress } from '../../../../engine/constants';
import moment from 'moment';
import { modalStyle } from '../../../../styles/mui/muiStyles';

const deadFunctionConversionProps = Constants.deadFunctionConversionProps;

const WillTab = ({
  willInfo,
  currentAccountIndex,
  currentNetwork,
  networks,
  accounts,
  setWillInfo,
  addWill,
  renounceWill,
  tokens,
}) => {
  let componentDestroyed = false;
  const { enqueueSnackbar } = useSnackbar();

  const [isWillSet, setIsWillSet] = useState(
    willContractAddress[currentNetwork] ? true : false
  );
  const [hasWill, setHasWill] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [period, setPeriod] = useState('');
  const [willTokenList, setWillTokenList] = useState({});
  const [error, setError] = useState({
    sendAddress: '',
    period: '',
    willTokenList: '',
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWill, setCurrentWill] = useState(undefined);

  const [showRenounceModal, setShowRenounceModal] = useState(false);

  useEffect(() => {
    return () => {
      componentDestroyed = true;
    };
  }, []);

  useEffect(() => {
    const network = networks[currentNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    setIsWillSet(willContractAddress[currentNetwork] ? true : false);
    if (!willContractAddress[currentNetwork]) {
      return;
    }
    setLoading(true);
    const willContract = new ethers.Contract(
      willContractAddress[currentNetwork],
      willContractAbi,
      provider
    );
    willContract
      .willOf(accounts[currentAccountIndex].address)
      .then((res) => {
        if (!componentDestroyed) {
          setWillInfo({
            testator: res.testator,
            fromTime: res.fromTime,
            afterTime: res.afterTime,
            willTokenList: res.tokens.reduce(
              (cur, adr) => Object.assign(cur, { [adr]: true }),
              {}
            ),
          });
          setLoading(false);
          setHasWill(res.fromTime.toNumber() === 0 ? false : true);
          setCurrentWill({
            testator: res.testator,
            fromTime: res.fromTime,
            afterTime: res.afterTime,
            willTokenList: res.tokens.reduce(
              (cur, adr) => Object.assign(cur, { [adr]: true }),
              {}
            ),
          });
        }
      })
      .catch((err) => {
        console.log('Will Get ERR: ', err);
        setLoading(false);
      });
  }, [currentNetwork, currentAccountIndex]);

  const checkCanSave = () => {
    if (sendAddress.length == 0 || period.length == 0) {
      return false;
    }
    let tempError = {
      sendAddress: '',
      period: '',
      willTokenList: '',
    };
    let canDo = true;
    if (!isValidAddress(sendAddress)) {
      tempError.sendAddress = 'Must be valid address.';
      canDo = false;
    }
    if (parseInt(period) !== Number(period)) {
      tempError.period = 'Must be valid integer.';
      canDo = false;
    }
    if (parseInt(period) < 1) {
      tempError.period = 'Must be bigger than 0.';
      canDo = false;
    }
    if (Object.keys(willTokenList).length === 0) {
      tempError.willTokenList =
        'Must select at least one token to add to your will.';
      canDo = false;
    }
    if (!canDo) {
      setError({ ...tempError });
    }

    return canDo;
  };

  const onSaveWill = () => {
    if (!checkCanSave()) {
      return;
    }
    setError({
      sendAddress: '',
      period: '',
      willTokenList: '',
    });
    addWill(
      {
        currentNetworkObject: networks[currentNetwork],
        currentAccount: accounts[currentAccountIndex],
        sendAddress,
        period,
        willTokenList: Object.keys(willTokenList),
      },
      () => {
        setSaveLoading(true);
      },
      (resWill) => {
        setSaveLoading(false);
        setHasWill(true);
        setCurrentWill({
          ...resWill,
          willTokenList: resWill.tokens.reduce(
            (cur, adr) => Object.assign(cur, { [adr]: true }),
            {}
          ),
        });
        setWillTokenList(
          resWill.tokens.reduce(
            (cur, adr) => Object.assign(cur, { [adr]: true }),
            {}
          )
        );
        setIsEditing(false);
        enqueueSnackbar('Successfully set Will.', {
          variant: 'success',
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
      (errText) => {
        setSaveLoading(false);
        enqueueSnackbar(errText, {
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
      }
    );
  };

  const renderCreateWillPanel = () => {
    const tokensList = tokens[currentNetwork.toString()]
      ? tokens[currentNetwork.toString()][currentAccountIndex]
        ? tokens[currentNetwork.toString()][currentAccountIndex].tokensList
        : []
      : [];

    return (
      <div className="mt-3 ml-1 mr-1 mb-3 overflow-auto flex-fill">
        <div className="ml-2 mr-2">
          <div
            className="text-white font-weight-bold"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Recepient Address
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            This is the address where you save all your crypto-currencies when
            your account is dead.
          </div>
          <SingleInput
            value={sendAddress}
            label="Recepient Address"
            onChangeValue={(value) => {
              setSendAddress(value);
              setError({ ...error, sendAddress: '' });
            }}
          />
          {error.sendAddress.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.sendAddress}
            </div>
          )}
        </div>
        <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Period
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            After this period (in days) since there is no action or change in
            your account, then all of your crypto-currencies will be moved to
            Recepient's Account.
          </div>
          <SingleInput
            value={period}
            label="Period (in days)"
            onChangeValue={(value) => {
              setPeriod(value);
              setError({ ...error, period: '' });
            }}
          />
          {error.period.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.period}
            </div>
          )}
        </div>
        <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Tokens
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Which tokens do you want to add to your will. Only the tokens added
            to your will list will be sent to the testator.
          </div>
          <FormGroup>
            {tokensList.map((token) => (
              <Tooltip
                key={'willlist_token' + token.tokenAddress}
                title={token.tokenAddress}
                arrow
              >
                <FormControlLabel
                  style={{
                    color: colors.grey9,
                  }}
                  control={
                    <Checkbox
                      checked={willTokenList[token.tokenAddress] ? true : false}
                      sx={{
                        color: colors.grey9,
                        '&.Mui-checked': {
                          color: colors.primary5,
                        },
                      }}
                      name={token.tokenSymbol}
                      onChange={(event) => {
                        let temp = Object.assign({}, willTokenList);
                        if (event.target.checked) {
                          temp[token.tokenAddress] = true;
                        } else {
                          delete temp[token.tokenAddress];
                        }
                        setWillTokenList(temp);
                      }}
                    />
                  }
                  label={token.tokenSymbol}
                />
              </Tooltip>
            ))}
          </FormGroup>
          {error.willTokenList.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.willTokenList}
            </div>
          )}
        </div>
        {/* <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white mt-1"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Crypto Conversion.
          </div>
          <div
            className="mt-1"
            style={{
              // ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Do you want to convert all your crypto assets before the dead
            function or just let them move as they are?
          </div>
          <div className="mt-1 d-flex flex-row">
            <FormControl>
              <RadioGroup
                className="text-white"
                name="crypto-conversion"
                onChange={(event) => {}}
              >
                {deadFunctionConversionProps.map((obj, i) => (
                  <FormControlLabel
                    key={'cryptoConversion_' + obj.value}
                    value={obj.value}
                    control={
                      <Radio
                        sx={{
                          color: colors.grey9,
                          '&.Mui-checked': {
                            color: colors.primary5,
                          },
                        }}
                      />
                    }
                    label={obj.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div> */}
        <div className="mt-4 ml-2 mr-2">
          <PrimaryButton
            text="Add Will"
            enableFlag={sendAddress.length > 0 && period.length > 0}
            onClick={() => {
              onSaveWill();
            }}
            loading={saveLoading}
          />
        </div>
      </div>
    );
  };

  const renderEditWillPanel = () => {
    const tokensList = tokens[currentNetwork.toString()]
      ? tokens[currentNetwork.toString()][currentAccountIndex]
        ? tokens[currentNetwork.toString()][currentAccountIndex].tokensList
        : []
      : [];

    return (
      <div className="mt-3 ml-1 mr-1 mb-3 overflow-auto flex-fill">
        <div className="ml-2 mr-2">
          <div
            className="text-white font-weight-bold"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Recepient Address
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            This is the address where you save all your crypto-currencies when
            your account is dead.
          </div>
          {!isEditing ? (
            <>
              {currentWill && (
                <div
                  style={{
                    // ...fonts.title2,
                    color: colors.primary2,
                    wordBreak: 'break-word',
                  }}
                >
                  {currentWill.testator}
                </div>
              )}
            </>
          ) : (
            <SingleInput
              value={sendAddress}
              label="Recepient Address"
              onChangeValue={(value) => {
                setSendAddress(value);
                setError({ ...error, sendAddress: '' });
              }}
            />
          )}

          {error.sendAddress.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.sendAddress}
            </div>
          )}
        </div>
        <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            {!isEditing ? 'Time' : 'Period'}
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            {!isEditing
              ? `When this time passesd, the testator you specified will be able to receive your money.`
              : `After this period (in days) since there is no action or change in
            your account, then all of your crypto-currencies will be moved to
            Recepient's Account.`}
          </div>
          {!isEditing ? (
            <>
              {currentWill && (
                <div
                  style={{
                    // ...fonts.title2,
                    color: colors.primary2,
                    wordBreak: 'break-word',
                  }}
                >
                  {'After ' +
                    moment(
                      new Date(
                        (currentWill.fromTime.toNumber() +
                          currentWill.afterTime.toNumber()) *
                          1000
                      ).valueOf()
                    )
                      .format('MMM DD, YYYY [at] hh:mm a')
                      .toString()}
                </div>
              )}
            </>
          ) : (
            <SingleInput
              value={period}
              label="Period (in days)"
              onChangeValue={(value) => {
                setPeriod(value);
                setError({ ...error, period: '' });
              }}
            />
          )}
          {error.period.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.period}
            </div>
          )}
        </div>
        <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Tokens
          </div>
          <div
            className="mt-1 mb-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Which tokens do you want to add to your will. Only the tokens added
            to your will list will be sent to the testator.
          </div>
          <FormGroup>
            {tokensList.map((token) => (
              <Tooltip
                key={'willlist_token' + token.tokenAddress}
                title={token.tokenAddress}
                arrow
              >
                <FormControlLabel
                  sx={{
                    color: colors.grey9,
                  }}
                  control={
                    <Checkbox
                      checked={
                        isEditing
                          ? willTokenList && willTokenList[token.tokenAddress]
                            ? true
                            : false
                          : currentWill &&
                            currentWill.willTokenList[token.tokenAddress]
                          ? true
                          : false
                      }
                      sx={{
                        color: colors.grey9,
                        '&.Mui-checked': {
                          color: colors.primary5,
                        },
                      }}
                      name={token.tokenSymbol}
                      onChange={(event) => {
                        if (!isEditing) {
                          return;
                        }
                        let temp = Object.assign({}, willTokenList);
                        if (event.target.checked) {
                          temp[token.tokenAddress] = true;
                        } else {
                          delete temp[token.tokenAddress];
                        }
                        setWillTokenList(temp);
                      }}
                    />
                  }
                  label={token.tokenSymbol}
                />
              </Tooltip>
            ))}
          </FormGroup>
          {error.willTokenList.length > 0 && (
            <div
              className="mt-1 pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.willTokenList}
            </div>
          )}
        </div>
        {/* <div className="mt-4 ml-2 mr-2">
          <div
            className="text-white mt-1"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Crypto Conversion.
          </div>
          <div
            className="mt-1"
            style={{
              // ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Do you want to convert all your crypto assets before the dead
            function or just let them move as they are?
          </div>
          <div className="mt-1 d-flex flex-row">
            <FormControl>
              <RadioGroup
                className="text-white"
                name="crypto-conversion"
                onChange={(event) => {}}
              >
                {deadFunctionConversionProps.map((obj, i) => (
                  <FormControlLabel
                    key={'cryptoConversion_' + obj.value}
                    value={obj.value}
                    control={
                      <Radio
                        sx={{
                          color: colors.grey9,
                          '&.Mui-checked': {
                            color: colors.primary5,
                          },
                        }}
                      />
                    }
                    label={obj.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>  */}
        <div className="mt-4 ml-2 mr-2">
          <PrimaryButton
            text={isEditing ? 'Save Will' : 'Edit Will'}
            enableFlag={
              isEditing ? sendAddress.length > 0 && period.length > 0 : true
            }
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
                setSendAddress('');
                setPeriod('');
              } else {
                onSaveWill();
              }
            }}
            loading={isEditing ? saveLoading : false}
          />
          {!isEditing && (
            <SecondaryButton
              text="Renounce Will"
              onClick={() => {
                setShowRenounceModal(true);
              }}
            />
          )}
          {isEditing && (
            <div className="mt-2">
              <SecondaryButton
                text="Cancel"
                onClick={() => {
                  setIsEditing(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRenounceModal = () => {
    return (
      <Modal
        open={showRenounceModal}
        onClose={() => {
          if (!removeLoading) {
            setShowRenounceModal(false);
          }
        }}
        aria-labelledby="will-renounce-modal-title"
        aria-describedby="will-renounce-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="will-renounce-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Do you really want to renounce your Will?
            </h6>
          </div>
          <div id="will-renounce-modal-description" className="mt-4">
            <PrimaryButton
              text="Sure"
              className="mt-4"
              loading={removeLoading}
              onClick={() => {
                renounceWill(
                  {
                    currentNetworkObject: networks[currentNetwork],
                    currentAccount: accounts[currentAccountIndex],
                  },
                  () => {
                    setRemoveLoading(true);
                  },
                  () => {
                    setRemoveLoading(false);
                    setCurrentWill(undefined);
                    setIsEditing(false);
                    setHasWill(false);
                    setShowRenounceModal(false);
                    enqueueSnackbar('Successfully renounced.', {
                      variant: 'success',
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
                  () => {
                    setRemoveLoading(false);
                    enqueueSnackbar('Something went wrong.', {
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
                  }
                );
              }}
            />
            <SecondaryButton
              className="mt-2"
              text="No"
              enableFlag={!removeLoading}
              onClick={() => {
                setShowRenounceModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderRenounceModal()}
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {!isWillSet ? (
            <div className="text-white display-v-h-center text-center h-100">
              <h3>Will is not set for this network yet.</h3>
            </div>
          ) : (
            <>{hasWill ? renderEditWillPanel() : renderCreateWillPanel()}</>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  currentNetwork: state.networks.currentNetwork,
  networks: state.networks.networks,
  currentAccountIndex: state.accounts.currentAccountIndex,
  accounts: state.accounts.accounts,
  willInfo: state.deadFunction.will,
  tokens: state.tokens.tokensData,
});
const mapDispatchToProps = (dispatch) => ({
  setWillInfo: (data) => setWillInfo(dispatch, data),
  addWill: (data, beforeWork, successCallback, failCallback) =>
    addWill(dispatch, data, beforeWork, successCallback, failCallback),
  renounceWill: (data, beforeWork, successCallback, failCallback) =>
    renounceWill(dispatch, data, beforeWork, successCallback, failCallback),
});
export default connect(mapStateToProps, mapDispatchToProps)(WillTab);
