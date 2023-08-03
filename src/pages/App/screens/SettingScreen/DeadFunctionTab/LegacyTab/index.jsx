import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './index.scss';

import { ethers } from 'ethers';

import { useNavigate } from 'react-router-dom';

import {
  receiveLegacy,
  registerLegacy,
  revokeLegacy,
} from '../../../../../Background/store/actions/DeadFunctionActions';

// import utils
import { getTokenDataFromAddress } from '../../../../utils/token';
import { isValidAddress } from '../../../../utils/common';
import moment from 'moment';

// import components
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';
import SingleInput from '../../../../components/CustomInputs/SingleInput';

//import constants
import { willContractAddress } from '../../../../engine/constants';

// import mui
import { Modal, Box, Button, Divider, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  modalStyle,
  useLegacyButtonStyles,
} from '../../../../styles/mui/muiStyles';
import { useSnackbar } from 'notistack';
import { colors } from '../../../../styles';

const LegacyTab = ({
  legacyInfo,
  networks,
  currentNetwork,
  accounts,
  currentAccountIndex,
  registerLegacy,
  revokeLegacy,
  receiveLegacy,
}) => {
  let symbolInfo = {};
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const legacyClasses = useLegacyButtonStyles();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLegacyModal, setShowLegacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedLegacy, setSelectedLegacy] = useState(undefined);

  const [tokenSymbolInfo, setTokenSymbolInfo] = useState({});

  const [isWillSet, setIsWillSet] = useState(
    willContractAddress[currentNetwork] ? true : false
  );

  const [heritorAddress, setHeritorAddress] = useState('');
  const [error, setError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [receiveError, setReceiveError] = useState('');

  useEffect(() => {
    setIsWillSet(willContractAddress[currentNetwork] ? true : false);
  }, [currentNetwork]);

  useEffect(() => {
    if (selectedLegacy) {
      symbolInfo = {};
      const network = networks[currentNetwork];
      selectedLegacy.willTokenList.map((adr) => {
        getTokenDataFromAddress(adr, network.rpc).then(({ symbol }) => {
          symbolInfo[adr] = symbol;
          if (
            Object.keys(symbolInfo).length >=
            selectedLegacy.willTokenList.length
          ) {
            setTokenSymbolInfo(symbolInfo);
          }
        });
      });
    }
  }, [selectedLegacy]);

  const onReceive = () => {
    receiveLegacy(
      {
        currentNetworkObject: networks[currentNetwork],
        currentAccount: accounts[currentAccountIndex],
        legacy: selectedLegacy,
      },
      () => {
        setReceiveLoading(true);
      },
      () => {
        setReceiveLoading(false);
        setShowLegacyModal(false);
        enqueueSnackbar('Legacy is received.', {
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
        navigate('/wallet');
      },
      (err) => {
        setReceiveError(err);
        setReceiveLoading(false);
      }
    );
  };

  const renderDeleteModal = () => {
    return (
      <Modal
        open={showDeleteModal}
        onClose={() => {
          if (!deleteLoading) {
            setShowDeleteModal(false);
          }
        }}
        aria-labelledby="legacy-delete-modal-title"
        aria-describedby="legacy-delete-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 300 }}>
          <h4 className="text-center text-white" id="legacy-delete-modal-title">
            Revoke Legacy
          </h4>
          <div id="legacy-delete-modal-description" className="mt-4">
            <h5 className="text-center text-white">
              Do you really want to revoke this legacy?
            </h5>
            <PrimaryButton
              className="mt-5"
              text="Yes, I am sure."
              onClick={() => {
                revokeLegacy(
                  { heritorAddress: selectedLegacy.heritorAddress },
                  () => {
                    setDeleteLoading(true);
                  },
                  () => {
                    setDeleteLoading(false);
                    setShowDeleteModal(false);
                    setShowLegacyModal(false);
                    enqueueSnackbar('Legacy is revoked.', {
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
                    setDeleteLoading(false);
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
              }}
              loading={deleteLoading}
            />
            <SecondaryButton
              className="mt-2"
              text="No."
              onClick={() => {
                setShowDeleteModal(false);
              }}
              enableFlag={!deleteLoading}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const renderLegacyModal = () => {
    return (
      <Modal
        open={showLegacyModal}
        onClose={() => {
          if (!receiveLoading) {
            setShowLegacyModal(false);
          }
        }}
        aria-labelledby="legacy-detail-modal-title"
        aria-describedby="legacy-detail-modal-description"
      >
        <Box sx={modalStyle}>
          <div
            id="legacy-detail-modal-title"
            className="d-flex flex-row align-items-center"
          >
            <h4 className="text-white text-center flex-fill">Legacy</h4>
            <IconButton
              onClick={() => {
                setShowDeleteModal(true);
              }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <Delete className="text-white" />
            </IconButton>
          </div>
          <div id="legacy-detail-modal-description" className="mt-4">
            {selectedLegacy ? (
              <>
                <div className="ml-2 mr-2">
                  <div
                    className="text-white font-weight-bold"
                    style={
                      {
                        // ...fonts.title2,
                      }
                    }
                  >
                    Heritor Address
                  </div>
                  <div
                    className="mt-1 mb-1"
                    style={{
                      //   ...fonts.para_regular,
                      color: colors.grey9,
                    }}
                  >
                    This is the heritor's address from where you can get money
                    as testant.
                  </div>
                  <div
                    style={{
                      // ...fonts.title2,
                      color: colors.primary2,
                      wordBreak: 'break-word',
                    }}
                  >
                    {selectedLegacy.heritorAddress}
                  </div>
                </div>
                <div className="mt-2 ml-2 mr-2">
                  <div
                    className="text-white font-weight-bold"
                    style={
                      {
                        //  ...fonts.title2,
                      }
                    }
                  >
                    Time
                  </div>
                  <div
                    className="mt-1 mb-1"
                    style={{
                      //   ...fonts.para_regular,
                      color: colors.grey9,
                    }}
                  >
                    When this time passesd, you can get Legacy from heritor.
                  </div>
                  <div
                    style={{
                      // ...fonts.title2,
                      color: colors.primary2,
                      wordBreak: 'break-word',
                    }}
                  >
                    {'After ' +
                      moment(new Date(selectedLegacy.time).valueOf())
                        .format('MMM DD, YYYY [at] hh:mm a')
                        .toString()}
                  </div>
                </div>
                <div className="mt-2 ml-2 mr-2">
                  <div
                    className="text-white font-weight-bold"
                    style={
                      {
                        // ...fonts.title2,
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
                    These are tokens you are going to be able to receive.
                  </div>

                  {selectedLegacy.willTokenList.map((adr) => (
                    <div
                      key={'will_token_list_' + adr}
                      style={{
                        // ...fonts.title2,
                        color: colors.primary2,
                        wordBreak: 'break-word',
                      }}
                    >
                      {adr}
                      {tokenSymbolInfo[adr] ? (
                        <span
                          className="ml-2 font-weight-bold"
                          style={{
                            color: colors.green4,
                          }}
                        >
                          {tokenSymbolInfo[adr]}
                        </span>
                      ) : (
                        <div
                          className="spinner-border loading-spinner ml-2"
                          role="status"
                          style={{
                            color: colors.primary5,
                            width: '15px',
                            height: '15px',
                            fontSize: 'x-small',
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                {receiveError.length > 0 && (
                  <div
                    className="mt-2 pl-2"
                    style={{
                      // ...fonts.caption_small12_16_regular,
                      color: colors.red5,
                    }}
                  >
                    {receiveError}
                  </div>
                )}

                <PrimaryButton
                  className="mt-5"
                  text="Receive"
                  onClick={() => {
                    onReceive();
                  }}
                  loading={receiveLoading}
                />
                <SecondaryButton
                  className="mt-2"
                  text="Cancel"
                  onClick={() => {
                    setShowLegacyModal(false);
                  }}
                  enableFlag={!receiveLoading}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </Box>
      </Modal>
    );
  };

  const renderLegacyRow = (legacy) => {
    return (
      <Button
        onClick={() => {
          setSelectedLegacy(legacy);
          setShowLegacyModal(true);
        }}
        key={'legacyFrom_' + legacy.heritorAddress}
        // classes={legacyClasses}
      >
        <div className="text-left">
          <div className="text-white d-flex flex-row">
            <div>Heritor:</div>
            <b
              className="ml-2"
              style={{
                wordBreak: 'break-word',
              }}
            >
              {legacy.heritorAddress}
            </b>
          </div>
          <div className="text-white mt-2 d-flex flex-row">
            <div>Time:</div>
            <b
              className="ml-2"
              style={{
                wordBreak: 'break-word',
              }}
            >
              {'After ' +
                moment(new Date(legacy.time).valueOf())
                  .format('MMM DD, YYYY [at] hh:mm a')
                  .toString()}
            </b>
          </div>
          <div className="text-white mt-2 d-flex flex-row">
            <div>Tokens:</div>
            <b
              className="ml-2"
              style={{
                wordBreak: 'break-word',
              }}
            >
              {`${legacy.willTokenList.length} tokens to receive.`}
            </b>
          </div>
        </div>
      </Button>
    );
  };

  const onRegisterLegacy = () => {
    if (!isValidAddress(heritorAddress)) {
      setError('Must be valid address.');
      return;
    }
    registerLegacy(
      {
        currentNetworkObject: networks[currentNetwork],
        currentAccount: accounts[currentAccountIndex],
        heritorAddress,
      },
      () => {
        setRegisterLoading(true);
      },
      () => {
        setRegisterLoading(false);
        setShowRegisterModal(false);
      },
      (err) => {
        setRegisterLoading(false);
        setError(err);
      }
    );
  };

  const renderRegisterModal = () => {
    return (
      <Modal
        open={showRegisterModal}
        onClose={() => {
          if (!registerLoading) {
            setShowRegisterModal(false);
          }
        }}
        aria-labelledby="register-legacy-modal-title"
        aria-describedby="register-legacy-modal-description"
      >
        <Box sx={modalStyle}>
          <h4
            id="register-legacy-modal-title"
            className="text-white text-center"
          >
            Register Legacy
          </h4>
          <div id="register-legacy-modal-description" className="mt-4">
            <SingleInput
              label={'Heritor Address'}
              value={heritorAddress}
              onChangeValue={(value) => {
                setHeritorAddress(value);
                setError('');
              }}
            />
            {error.length > 0 && (
              <div
                className="mt-1 pl-2"
                style={{
                  // ...fonts.caption_small12_16_regular,
                  color: colors.red5,
                }}
              >
                {error}
              </div>
            )}
            <PrimaryButton
              className="mt-4"
              text="Register"
              enableFlag={heritorAddress.length > 0}
              loading={registerLoading}
              onClick={() => {
                onRegisterLegacy();
              }}
            />
            <SecondaryButton
              className="mt-2"
              text="Cancel"
              enableFlag={!registerLoading}
              onClick={() => {
                setShowRegisterModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderDeleteModal()}
      {renderRegisterModal()}
      {renderLegacyModal()}
      {isWillSet ? (
        <div className="h-100 d-flex flex-column">
          <div className="flex-fill overflow-auto">
            {legacyInfo.map((legacy, index) => {
              if (index < legacyInfo.length - 1) {
                return (
                  <>
                    {renderLegacyRow(legacy)}
                    <Divider style={{ backgroundColor: colors.grey9 }} />
                  </>
                );
              } else {
                return renderLegacyRow(legacy);
              }
            })}
          </div>
          <div>
            <PrimaryButton
              text="Register Legacy"
              onClick={() => {
                setShowRegisterModal(true);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="text-white display-v-h-center text-center h-100">
          <h3>Will is not set for this network yet.</h3>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  legacyInfo: state.deadFunction.legacy,
  currentNetwork: state.networks.currentNetwork,
  networks: state.networks.networks,
  currentAccountIndex: state.accounts.currentAccountIndex,
  accounts: state.accounts.accounts,
});
const mapDispatchToProps = (dispatch) => ({
  registerLegacy: (data, beforeWork, successCallback, failCallback) =>
    registerLegacy(dispatch, data, beforeWork, successCallback, failCallback),
  revokeLegacy: (data, beforeWork, successCallback, failCallback) =>
    revokeLegacy(dispatch, data, beforeWork, successCallback, failCallback),
  receiveLegacy: (data, beforeWork, successCallback, failCallback) =>
    receiveLegacy(dispatch, data, beforeWork, successCallback, failCallback),
});
export default connect(mapStateToProps, mapDispatchToProps)(LegacyTab);
