import React, { useState } from 'react';
import { connect } from 'react-redux';

import { useNavigate, Navigate } from 'react-router-dom';

import PasswordInput from '../../components/CustomInputs/PasswordInput';
import MultilineInput from '../../components/CustomInputs/MultilineInput';
import CustomSwitch from '../../components/CustomSwitch';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';

import { colors } from '../../styles';

// import material
import { Check, KeyboardArrowLeft } from '@mui/icons-material';

//import ethers util
import { utils } from 'ethers';

import { passwordStrength } from 'check-password-strength';

import Constants from '../../constants';
import { Box, IconButton, Modal } from '@mui/material';
import {
  createWallet,
  // testAction,
} from '../../../Background/store/actions/WalletActions';
const passwordStrengthCheckOption = Constants.passwordStrengthCheckOption;
const passwordLevelColor = Constants.passwordLevelColor;

import { modalStyle } from '../../styles/mui/muiStyles';

const ImportWallet = ({ createWallet, walletInfo }) => {
  const navigate = useNavigate();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signInWithFaceId, setSignInWithFaceId] = useState(true);
  const [canPass, setCanPass] = useState(false);
  const [passwordStrengthLabel, setPasswordStrengthLabel] =
    useState('No Password');
  const [createPasswordModalVisible, setCreatePasswordModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const checkCanPass = (data) => {
    if (!data.seedPhrase) {
      setCanPass(false);
      return;
    }
    if (!data.password) {
      setCanPass(false);
      return;
    }
    if (!data.confirmPassword) {
      setCanPass(false);
      return;
    }
    if (data.confirmPassword !== data.password) {
      setCanPass(false);
      return;
    }
    if (!utils.isValidMnemonic(data.seedPhrase)) {
      setCanPass(false);
      return;
    }
    setCanPass(true);
  };

  const onImportWallet = () => {
    createWallet(
      {
        password,
        mnemonic: seedPhrase,
      },
      () => {
        setLoading(true);
      },
      () => {
        console.log('success on press import');
        setLoading(false);
        setCreatePasswordModalVisible(false);
        navigate('/wallet');
      },
      () => {
        console.log('fail on press import');
        setLoading(false);
        setCreatePasswordModalVisible(false);
      }
    );
  };

  return (
    <>
      {walletInfo.isInitialized ? (
        walletInfo.isLocked ? (
          <Navigate to="/login" />
        ) : (
          <Navigate to="/wallet" />
        )
      ) : (
        <div className="vh-100">
          <div className="pt-4 text-center display-v-h-center h-100">
            <Modal
              open={createPasswordModalVisible}
              onClose={() => {}}
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <b className="text-white text-center">
                    <span
                      style={
                        {
                          // ...fonts.title2
                        }
                      }
                    >
                      Password is not strong.
                    </span>
                    {'\n'}Are you sure you want to use this passord?
                  </b>
                  <div
                    style={{
                      marginTop: 24,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <PrimaryButton
                      enableFlag={!loading}
                      onClick={() => {
                        setCreatePasswordModalVisible(false);
                      }}
                      text={'No, try again.'}
                    />
                    <SecondaryButton
                      onClick={() => {
                        onImportWallet();
                      }}
                      className="mt-1"
                      text="Yes, I am sure."
                      loading={loading}
                    />
                  </div>
                </div>
              </Box>
            </Modal>
            <form className="col-lg-4 col-md-5 col-sm-6 col-xs-8 ml-2 mr-2 h-100 mb-5 d-flex flex-column">
              <div className="d-flex flex-row align-items-center mt-2">
                <IconButton
                  onClick={() => {
                    navigate(-1);
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  edge="start"
                >
                  <KeyboardArrowLeft
                    className="text-white"
                    fontSize={'medium '}
                  />
                </IconButton>
                <h4 className="text-white flex-fill">Import Wallet</h4>
              </div>
              <div>
                <MultilineInput
                  value={seedPhrase}
                  onChangeValue={(value) => {
                    setSeedPhrase(value);
                    checkCanPass({
                      password,
                      confirmPassword,
                      seedPhrase: value,
                    });
                  }}
                  label="Seed Phrase"
                  editable={true}
                />
              </div>
              <div className="text-left">
                {seedPhrase.length > 0 && (
                  <div
                    className="pl-3 d-flex flex-row"
                    style={{
                      // ...fonts.caption_small12_16_regular,
                      color: utils.isValidMnemonic(seedPhrase)
                        ? colors.green5
                        : colors.grey12,
                    }}
                  >
                    {utils.isValidMnemonic(seedPhrase)
                      ? 'Valid Seed Phrase '
                      : 'Seed Phrase must be valid. '}
                    {utils.isValidMnemonic(seedPhrase) && (
                      <Check color={colors.green5} />
                    )}
                  </div>
                )}
              </div>
              <div>
                <PasswordInput
                  value={password}
                  onChangeValue={(value) => {
                    setPassword(value);
                    checkCanPass({
                      password: value,
                      confirmPassword,
                      seedPhrase,
                    });
                    setPasswordStrengthLabel(
                      passwordStrength(value, passwordStrengthCheckOption).value
                    );
                  }}
                  label={'New Password'}
                />
              </div>
              <div className="text-left">
                {password.length > 0 && (
                  <>
                    <div
                      className="pl-3"
                      style={{
                        // ...fonts.caption_small12_16_regular,
                        color: colors.grey12,
                      }}
                    >
                      Password strength:{' '}
                      <span
                        style={{
                          color: passwordLevelColor[passwordStrengthLabel],
                        }}
                      >
                        {passwordStrengthLabel}
                      </span>
                    </div>
                    {password.length < 8 && (
                      <div
                        className="pl-3 pt-1"
                        style={{
                          // ...fonts.caption_small12_16_regular,
                          color: colors.grey12,
                        }}
                      >
                        Must be at least 8 characters.
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <PasswordInput
                  value={confirmPassword}
                  onChangeValue={(value) => {
                    setConfirmPassword(value);
                    checkCanPass({
                      password,
                      confirmPassword: value,
                      seedPhrase,
                    });
                  }}
                  label={'Confirm Password'}
                />
              </div>
              <div className="text-left">
                {confirmPassword.length > 0 && (
                  <div
                    className="pl-3"
                    style={{
                      // ...fonts.caption_small12_16_regular,
                      color:
                        password === confirmPassword
                          ? colors.green5
                          : colors.grey12,
                    }}
                  >
                    {password === confirmPassword
                      ? 'Password matched. '
                      : 'Password must match. '}
                    {password === confirmPassword && (
                      <Check color={colors.green5} />
                    )}
                  </div>
                )}
              </div>
              <div className="justify-content-between d-inline-flex align-items-center w-100">
                <div className="text-white font-weight-bold">
                  Sign In With Face ID?
                </div>
                <CustomSwitch
                  checked={signInWithFaceId}
                  onChange={(event) => {
                    setSignInWithFaceId(event.target.checked);
                  }}
                />
              </div>
              <div style={{ color: colors.grey12, textAlign: 'left' }}>
                By proceeding, you agree to these{' '}
                <span style={{ textDecoration: 'underline' }}>
                  Term and Conditions.
                </span>
              </div>
              <div
                className="mt-4"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column-reverse',
                }}
              >
                <SecondaryButton
                  className="mb-4"
                  text="Import"
                  onClick={() => {
                    if (
                      passwordStrength(password, passwordStrengthCheckOption)
                        .id < 2
                    ) {
                      setCreatePasswordModalVisible(true);
                      return;
                    }
                    onImportWallet();
                  }}
                  enableFlag={canPass}
                  loading={loading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  walletInfo: state.wallet,
});
const mapDispatchToProps = (dispatch) => ({
  createWallet: (data, beforeWork, successCallback, failCallback) =>
    createWallet(dispatch, data, beforeWork, successCallback, failCallback),
  // testAction: () => testAction(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportWallet);
