import React, { useState } from 'react';
import { connect } from 'react-redux';

//import actions
import {
  setAutoLockTime,
  setIncomingTxn,
  setInMetaMetrics,
  setPrivacyMode,
  setSignInWithFaceId,
} from '../../../../../Background/store/actions/SettingsActions';

//import components
import ChangePassword from './ChangePassword';
import RevealSeed from './RevealSeed';
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '../../../../components/Buttons';
import CustomSwitch from '../../../../components/CustomSwitch';

//import constants
import Constants from '../../../../constants';
const autoLockProps = Constants.autoLockProps;

//import mui
import { Modal, Box, Button } from '@mui/material';
import { CheckCircle, KeyboardArrowDown } from '@mui/icons-material';
import { modalStyle } from '../../../../styles/mui/muiStyles';

//import styles
import { colors, fonts } from '../../../../styles';

const SecurityAndPrivacy = ({
  settingsInfo,
  setAutoLockTime,
  setIncomingTxn,
  setInMetaMetrics,
  setPrivacyMode,
  setSignInWithFaceId,
}) => {
  const {
    autoLockTime,
    signInWithFaceId,
    privacyMode,
    inMetaMetrics,
    incomingTxn,
  } = settingsInfo;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAutoLockModal, setShowAutoLockModal] = useState(false);
  const [showRevealSeedModal, setShowRevealSeedModal] = useState(false);

  const [isBackedUp, setIsBackedUp] = useState(false);

  const renderPasswordModal = () => {
    return (
      <Modal
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
        }}
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
      >
        <Box sx={modalStyle}>
          <div
            id="change-password-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            <ChangePassword />
          </div>
        </Box>
      </Modal>
    );
  };

  const renderAutoLockModal = () => {
    return (
      <Modal
        open={showAutoLockModal}
        onClose={() => {
          setShowAutoLockModal(false);
        }}
        aria-labelledby="auto-lock-modal-title"
        aria-describedby="auto-lock-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="auto-lock-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Auto-Lock
            </h6>
          </div>
          <div id="auto-lock-modal-description" className="text-white mt-3">
            {autoLockProps.map((option) => {
              return (
                <Button
                  className="p-2 mb-1 d-flex flex-row align-items-center w-100"
                  key={'securityandprivacy_' + option.value}
                  onClick={() => {
                    setAutoLockTime(option);
                    setShowAutoLockModal(false);
                  }}
                >
                  <div
                    className="text-white flex-fill text-left"
                    style={
                      {
                        // ...fonts.para_regular,
                      }
                    }
                  >
                    {option.label}
                  </div>
                  {autoLockTime.value == option.value && (
                    <CheckCircle
                      style={{
                        fontSize: '18px',
                        color: colors.green5,
                      }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </Box>
      </Modal>
    );
  };

  const revealSeedModal = () => {
    return (
      <Modal
        open={showRevealSeedModal}
        onClose={() => {
          setShowRevealSeedModal(false);
        }}
        aria-labelledby="reveal-seed-modal-title"
        aria-describedby="reveal-seed-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="reveal-seed-modal-description" className="text-white">
            <RevealSeed
              onDone={() => {
                setShowRevealSeedModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderPasswordModal()}
      {renderAutoLockModal()}
      {revealSeedModal()}
      <div className="mt-4 ml-1 mr-1 mb-3 overflow-auto">
        <div
          className="text-white text-left font-weight-bold"
          style={
            {
              // ...fonts.title2
            }
          }
        >
          Security
        </div>
        <div className="mt-4">
          <div
            className="text-white font-weight-bold text-left"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Protect your wallet
          </div>
          <div
            className="mt-1"
            style={{
              // ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Display fiat values in using o specific currency throughout the
            application
          </div>
          {isBackedUp && (
            <div className="d-flex flex-row mt-2 mb-2 align-items-center">
              <div
                className="p-1 pl-2 pr-2 d-flex flex-row align-items-center"
                style={{
                  borderRadius: '100px',
                  backgroundColor: colors.green5 + '44',
                }}
              >
                <CheckCircle
                  style={{
                    fontSize: '18px',
                    color: colors.green5,
                  }}
                />
                <div
                  className="ml-1"
                  style={{
                    color: colors.green5,
                    // ...fonts.caption_small12_16_regular,
                  }}
                >
                  Seed Phrase backed up
                </div>
              </div>
            </div>
          )}
          <div className="d-flex flex-row align-items-center justify-content-around mt-3 ml-2 mr-2">
            <TextButton
              className="m-0"
              text="Back up"
              onClick={() => {
                setIsBackedUp(true);
              }}
            />
            <PrimaryButton
              className="m-0"
              text="Reveal Seed Phrase"
              onClick={() => {
                setShowRevealSeedModal(true);
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <div
            className="font-weight-bold text-white text-left"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Protect Your Wallet
          </div>
          <div
            className="mt-1"
            style={{
              color: colors.grey9,
              // ...fonts.para_regular
            }}
          >
            Display fiat values in using o specific currency throughout the
            application
          </div>
          <div style={{ marginTop: 24 }}>
            <TextButton
              text="Change Password"
              onClick={() => {
                setShowPasswordModal(true);
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <div
            className="text-white font-weight-bold"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Auto-Lock
          </div>
          <div
            className="mt-1"
            style={{
              color: colors.grey9,
              // ...fonts.para_regular
            }}
          >
            Choose the amount of time before the application automatically locks
          </div>
          <div className="mt-3 ml-2 mr-2">
            <Button
              className="w-100 border"
              style={{
                borderWidth: '2px',
                borderRadius: '8px',
                borderColor: colors.grey9,
              }}
              onClick={() => {
                setShowAutoLockModal(true);
              }}
            >
              <div
                className="text-white flex-fill text-left font-weight-bold"
                style={
                  {
                    // ...fonts.para_semibold,
                  }
                }
              >
                {autoLockTime.label}
              </div>
              <KeyboardArrowDown
                className="text-white"
                style={{ fontSize: '18px' }}
              />
            </Button>
          </div>
        </div>
        <div className="mt-4 d-flex flex-row align-items-center">
          <div
            className="text-white font-weight-bold flex-fill"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            Sign In With Face ID?
          </div>
          <CustomSwitch
            checked={signInWithFaceId}
            onChange={(event) => {
              setSignInWithFaceId(event.target.checked);
            }}
          />
        </div>
        <div className="mt-4">
          <div
            className="font-weight-bold text-white"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Show Private Key for "Jersey Pinkman"
          </div>
          <div
            className="mt-1"
            style={{
              color: colors.grey9,
              //   ...fonts.para_regular,
            }}
          >
            This is the private key for the current selected account: Account1.
            Never disclose this key. Anyone with your private key can fully
            control your account, including transferring away any of your funds.
          </div>
        </div>
        <div className="mt-4">
          <div
            className="font-weight-bold text-white text-left"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Privacy
          </div>
        </div>
        <div className="mt-4 ml-2 mr-2">
          <div
            className="font-weight-bold text-white text-left"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Clear Privacy Data
          </div>
          <div
            className="mt-1"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Clear Priacy data so all websites must request access to view
            account information again
          </div>
          <div className="mt-2">
            <SecondaryButton
              text="Clear Privacy Data"
              enableFlag={false}
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="mt-4 ml-1 mr-1">
          <div className="d-flex flex-row align-items-row">
            <div
              className="font-weight-bold text-white text-left flex-fill"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Private Mode
            </div>
            <CustomSwitch
              checked={privacyMode}
              onChange={(event) => {
                setPrivacyMode(event.target.checked);
              }}
            />
          </div>
          <div
            className="mt-2"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Website must request access to view your account information
          </div>
        </div>
        <div className="mt-4 ml-1 mr-1">
          <div className="d-flex flex-row align-items-center">
            <div
              className="text-white font-weight-bold text-left flex-fill"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Participate in MetaMetrics
            </div>
            <CustomSwitch
              checked={inMetaMetrics}
              onChange={(event) => {
                setInMetaMetrics(event.target.checked);
              }}
            />
          </div>
          <div
            className="mt-2"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Participate in MetaMetrics to help us make DefiSquid better
          </div>
        </div>
        <div className="mt-4 ml-1 mr-1">
          <div className="d-flex flex-row align-items-center">
            <div
              className="text-white text-left font-weight-bold flex-fill"
              style={
                {
                  //  ...fonts.title2,
                }
              }
            >
              Get Incoming Transactions
            </div>
            <CustomSwitch
              checked={incomingTxn}
              onChange={(event) => {
                setIncomingTxn(event.target.checked);
              }}
            />
          </div>
          <div
            className="mt-2"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Third party APIs: Etherscan are used to show your incoming
            transactions in the history. Turn off if you don’t want us to pull
            data from those service
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  settingsInfo: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  setAutoLockTime: (value) => setAutoLockTime(dispatch, value),
  setSignInWithFaceId: (value) => setSignInWithFaceId(dispatch, value),
  setPrivacyMode: (value) => setPrivacyMode(dispatch, value),
  setInMetaMetrics: (value) => setInMetaMetrics(dispatch, value),
  setIncomingTxn: (value) => setIncomingTxn(dispatch, value),
});
export default connect(mapStateToProps, mapDispatchToProps)(SecurityAndPrivacy);
