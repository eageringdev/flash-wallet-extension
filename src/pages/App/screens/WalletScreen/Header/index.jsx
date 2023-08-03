import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import browser
import browser from 'webextension-polyfill';

//import actions
import {
  createNewAccount,
  importAccount,
  setCurrentAccountIndex,
} from '../../../../Background/store/actions/AccountsActions';
import { setCurrentNetwork } from '../../../../Background/store/actions/NetworkActions';
import { getFeeData } from '../../../../Background/store/actions/EngineActions';

//import utils
import { isValidPrivateKey } from '../../../utils/common';

//import components
import BalanceText from '../../../components/BalanceText';
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '../../../components/Buttons';
import SingleInput from '../../../components/CustomInputs/SingleInput';
import MultilineInput from '../../../components/CustomInputs/MultilineInput';

//import mui
import { Avatar, Badge, Box, Button, Modal } from '@mui/material';
import {
  KeyboardArrowDown,
  CheckCircle,
  KeyboardArrowLeft,
} from '@mui/icons-material';

//import assets
import { colors, fonts } from '../../../styles';
import Constants from '../../../constants';

const avatars = Constants.avatars;
const avatarsCount = Constants.avatarsCount;

import { modalStyle } from '../../../styles/mui/muiStyles';

const Header = ({
  accounts,
  currentAccountIndex,
  currentNetwork,
  networks,
  createNewAccount,
  setCurrentAccountIndex,
  importAccount,
  setCurrentNetwork,
  getFeeData,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const [accountStatus, setAccountStatus] = useState('default');
  const [accountName, setAccountName] = useState('');
  const [importedPrivateKey, setImportedPrivateKey] = useState('');
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [importAccountError, setImportAccountError] = useState('');
  const [importAccountLoading, setImportAccountLoading] = useState(false);

  const networksKeys = Object.keys(networks);

  const renderNetworkRow = (network, isSelected) => {
    const networkName = network.name;
    const networkColor = network.color;

    return (
      <Button
        className="w-100"
        key={network.chainId || networkName}
        onClick={() => {
          setCurrentNetwork(network.chainId.toString());
          getFeeData(network);
          setShowNetworkModal(false);
        }}
      >
        <div className="p-1 pt-2 pb-2 d-flex flex-row w-100">
          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: networkColor,
                marginRight: 16,
              }}
            ></div>
            <div
              style={{
                // ...fonts.para_regular,
                color: 'white',
              }}
            >
              {networkName}
            </div>
          </div>
          {isSelected && (
            <div className="d-flex flex-row-reverse flex-fill ml-2">
              <CheckCircle style={{ fontSize: 24, color: colors.green5 }} />
            </div>
          )}
        </div>
      </Button>
    );
  };

  const renderNetworkModal = () => {
    return (
      <Modal
        open={showNetworkModal}
        onClose={() => {
          setShowNetworkModal(false);
        }}
        aria-labelledby="network-modal-title"
        aria-describedby="network-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="network-modal-title">
            <h6 className="font-weight-bold text-center text-white">Network</h6>
          </div>
          <div id="network-modal-description" sx={{ mt: 4 }}>
            <div className="p-2">
              {networks &&
                networks[currentNetwork] &&
                renderNetworkRow(networks[currentNetwork], true)}
            </div>
            <div className="ml-2 mr-2 mt-2">
              <div
                style={{
                  // ...fonts.title2,
                  color: colors.grey9,
                }}
              >
                Other Network
              </div>
              <div className="mt-2">
                {networksKeys.map((key) => {
                  if (key !== currentNetwork) {
                    return (
                      networks &&
                      networks[key] &&
                      renderNetworkRow(networks[key], false)
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderAccountRow = (account, isSelected) => {
    const accountName = account.name;
    const accountIcon = (
      <Avatar
        variant="rounded"
        style={{ width: '24px', height: '24px' }}
        src={avatars[parseInt(account.icon) % avatarsCount]}
      />
    );

    return (
      <Button
        key={account.address}
        onClick={() => {
          setShowAccountModal(false);
          setCurrentAccountIndex(account.index);
        }}
        className="w-100"
      >
        <div className="d-flex flex-row align-items-center p-2 ml-2 mr-2 w-100">
          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.grey23,
                marginRight: 16,
              }}
            >
              <div style={{ position: 'relative', left: 0, top: 0 }}>
                {accountIcon}
              </div>
            </div>
            <div className="text-left">
              <div>
                <div
                  style={{
                    // ...fonts.title2,
                    color: 'white',
                  }}
                >
                  {accountName}
                </div>
              </div>
              <div>
                <BalanceText
                  style={{
                    // ...fonts.caption_small12_18_regular,
                    color: colors.grey9,
                  }}
                  address={account.address}
                />
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="d-flex flex-row-reverse flex-fill">
              <CheckCircle style={{ fontSize: 24, color: colors.green5 }} />
            </div>
          )}
        </div>
      </Button>
    );
  };

  let refinedAccountsArray = [];
  if (accounts) {
    refinedAccountsArray = [].concat(accounts);
    refinedAccountsArray.sort((a, b) => {
      if (a.isImported && !b.isImported) return 1;
      else if (!a.isImported && b.isImported) return -1;
    });
  }

  const renderAccountModal = () => {
    const renderDefaultAccountModal = () => {
      return (
        <div>
          <div className="mt-2">
            {refinedAccountsArray &&
              refinedAccountsArray.map((account) => {
                return renderAccountRow(
                  account,
                  account.index === currentAccountIndex
                );
              })}
          </div>
          <div className="mt-2">
            <TextButton
              text="Create New Account"
              onClick={() => {
                setAccountStatus('create_account');
              }}
            />
          </div>
          <div className="mt-2">
            <TextButton
              text="Import Account"
              onClick={() => {
                setAccountStatus('import_account');
              }}
            />
          </div>
        </div>
      );
    };

    const renderCreateAccountModal = () => {
      return (
        <div>
          <div className="mt-2 pt-1 d-flex align-items-center justify-content-center">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.grey23,
              }}
            >
              <img
                src="./assets/images/backimage.png"
                style={{
                  position: 'relative',
                  left: '0px',
                  top: '0px',
                  width: '24px',
                  height: '24px',
                }}
              />
            </div>
          </div>
          <div
            className="mt-2"
            style={{ marginLeft: '25%', marginRight: '25%' }}
          >
            <SecondaryButton onClick={() => {}} text="Choose an icon" />
          </div>
          <div style={{ marginTop: 40, marginHorizontal: 32 }}>
            <SingleInput
              label={'Account Name'}
              value={accountName}
              onChangeValue={(value) => {
                setAccountName(value);
              }}
            />
          </div>
          <div style={{ marginTop: 48, marginHorizontal: 24 }}>
            <PrimaryButton
              loading={createAccountLoading}
              onClick={() => {
                createNewAccount(
                  accountName,
                  () => {
                    setCreateAccountLoading(true);
                  },
                  () => {
                    console.log('Success create a new Account');
                    setShowAccountModal(false);
                    setCreateAccountLoading(false);
                  },
                  () => {
                    setCreateAccountLoading(false);
                    console.log('ERROR!!!!: ', 'Create A new Account');
                  }
                );
              }}
              enableFlag={accountName.length > 0}
              text="Create"
            />
          </div>
        </div>
      );
    };

    const renderImportAccountModal = () => {
      return (
        <div>
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              marginHorizontal: 24,
            }}
          >
            <div
              className="text-white"
              style={
                {
                  // ...fonts.caption_large_regular
                }
              }
            >
              Imported accounts are viewaable in your wallet but are not
              recoverable with your DeGe seed phrase.
            </div>
          </div>
          <div className="mt-2">
            <div
              style={{
                // ...fonts.caption_large_regular,
                color: 'white',
              }}
            >
              Learn more about imported accounts{' '}
              <span
                style={{
                  color: colors.blue5,
                  // ...fonts.caption_large_semibold,
                }}
              >
                here
              </span>
              .
            </div>
          </div>
          <div className="mt-4">
            <div
              style={{
                //  ...fonts.title2,
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              Paste your private key string
            </div>
          </div>
          <div style={{ marginTop: 16, marginHorizontal: 24 }}>
            <MultilineInput
              label={'Private Key'}
              row={4}
              onChangeValue={(value) => {
                setImportAccountError('');
                setImportedPrivateKey(value);
              }}
              value={importedPrivateKey}
            />
            {importAccountError.length > 0 && (
              <div
                style={{
                  paddingLeft: 16,
                  // ...fonts.caption_small12_16_regular,
                  color: colors.red5,
                }}
              >
                {importAccountError}
              </div>
            )}
          </div>
          <div className="mt-4">
            <PrimaryButton
              loading={importAccountLoading}
              onClick={() => {
                if (!isValidPrivateKey(importedPrivateKey)) {
                  setImportAccountError('Not a valid private key.');
                } else {
                  importAccount(
                    importedPrivateKey,
                    () => {
                      setImportAccountLoading(true);
                    },
                    () => {
                      setShowAccountModal(false);
                      setImportAccountLoading(false);
                      console.log('import account success');
                    },
                    (failMessage) => {
                      setImportAccountLoading(false);
                      setImportAccountError(failMessage);
                    }
                  );
                }
              }}
              text={'Import Account'}
              enableFlag={importedPrivateKey.length > 0}
            />
          </div>
        </div>
      );
    };

    return (
      <Modal
        open={showAccountModal}
        onClose={() => {
          setShowAccountModal(false);
        }}
        aria-labelledby="account-modal-title"
        aria-describedby="account-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="account-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              {accountStatus === 'default' && 'Account'}
              {accountStatus === 'create_account' && (
                <div className="pt-1 d-flex flex-row align-items-center">
                  <Button
                    className="ml-1"
                    onClick={() => {
                      setAccountStatus('default');
                    }}
                  >
                    <KeyboardArrowLeft
                      style={{ fontSize: 16, color: 'white' }}
                    />
                  </Button>
                  <div className="flex-fill" style={{ marginLeft: '-50px' }}>
                    <div
                      className="text-white text-center"
                      style={
                        {
                          // ...fonts.title2
                        }
                      }
                    >
                      Create Account
                    </div>
                  </div>
                </div>
              )}
              {accountStatus === 'import_account' && (
                <div className="pt-1 d-flex flex-row align-items-center">
                  <Button
                    className="ml-1"
                    onClick={() => {
                      setAccountStatus('default');
                    }}
                  >
                    <KeyboardArrowLeft
                      style={{ fontSize: 16, color: 'white' }}
                    />
                  </Button>
                  <div className="flex-fill" style={{ marginLeft: '-50px' }}>
                    <div
                      className="text-center text-white"
                      style={
                        {
                          // ...fonts.title2
                        }
                      }
                    >
                      Import Account
                    </div>
                  </div>
                </div>
              )}
            </h6>
          </div>
          <div id="account-modal-description" sx={{ mt: 4 }}>
            {accountStatus === 'default' && renderDefaultAccountModal()}
            {accountStatus === 'create_account' && renderCreateAccountModal()}
            {accountStatus === 'import_account' && renderImportAccountModal()}
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <div className="w-100">
      <div className="w-100 d-flex flex-row align-items-center justify-content-center">
        {renderNetworkModal()}
        {renderAccountModal()}
        <Button
          style={{ width: '44px', height: '44px' }}
          onClick={() => {
            setShowAccountModal(true);
            setAccountStatus('default');
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <img
                className="rounded"
                alt="Remy Sharp"
                src="./assets/avatars/avatar_badge.svg"
              />
            }
          >
            <Avatar
              style={{ width: '36px', height: '36px' }}
              alt="Avatar"
              src={
                accounts
                  ? accounts[currentAccountIndex]
                    ? avatars[accounts[currentAccountIndex].icon % avatarsCount]
                    : avatars[0]
                  : avatars[0]
              }
            />
          </Badge>
        </Button>
        <div className="flex-fill text-center">
          <Button
            onClick={() => {
              setShowNetworkModal(true);
            }}
          >
            <div className="d-flex align-items-center justify-content-center">
              <div
                style={{
                  // ...fonts.caption_small12_16_regular,
                  color: 'white',
                }}
              >
                {networks && currentNetwork
                  ? networks[currentNetwork].name
                  : '...'}
              </div>
              <KeyboardArrowDown className="text-white" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  currentNetwork: state.networks.currentNetwork,
  networks: state.networks.networks,
});
const mapDispatchToProps = (dispatch) => ({
  //account actions
  createNewAccount: (accountName, beforeWork, successCallback, errorCallback) =>
    createNewAccount(
      dispatch,
      accountName,
      beforeWork,
      successCallback,
      errorCallback
    ),
  setCurrentAccountIndex: (index) => setCurrentAccountIndex(dispatch, index),
  importAccount: (privateKey, beforeWork, successCallback, failCallback) =>
    importAccount(
      dispatch,
      privateKey,
      beforeWork,
      successCallback,
      failCallback
    ),

  //network actions
  setCurrentNetwork: (network) => setCurrentNetwork(dispatch, network),

  //engine
  getFeeData: (currentNetworkObject) =>
    getFeeData(dispatch, currentNetworkObject),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
