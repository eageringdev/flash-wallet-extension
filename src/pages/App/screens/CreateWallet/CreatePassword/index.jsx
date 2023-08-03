import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { passwordStrength } from 'check-password-strength';

// import mui
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
} from '@mui/material';
import { Check, KeyboardArrowLeft } from '@mui/icons-material';

//import components
import LoadingScreen from '../../../components/LoadingScreen';
import Bars from '../../../components/Bars';
import { colors } from '../../../styles';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import PasswordInput from '../../../components/CustomInputs/PasswordInput';

import Constants from '../../../constants';
import CustomSwitch from '../../../components/CustomSwitch';
import { clearTempStorage, setTempPassword } from '../../../utils/temp';
import GradientText from '../../../components/GradientText';

const passwordStrengthCheckOption = Constants.passwordStrengthCheckOption;
const passwordLevelColor = Constants.passwordLevelColor;

import { modalStyle } from '../../../styles/mui/muiStyles';

const CreatePassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signInWithFaceId, setSignInWithFaceId] = useState(true);
  const [canPass, setCanPass] = useState(false);
  const [passwordStrengthLabel, setPasswordStrengthLabel] =
    useState('No Password');
  const [createPasswordModalVisible, setCreatePasswordModalVisible] =
    useState(false);
  const [isAgreeChecked, setIsAgreeChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tempLoading, setTempLoading] = useState(false);

  useEffect(() => {
    clearTempStorage(
      () => {
        setTempLoading(true);
      },
      () => {
        setTempLoading(false);
      },
      () => {
        setTempLoading(false);
      }
    );
  }, []);

  const checkCanPass = (data) => {
    if (!data.password) {
      setCanPass(false);
      return;
    }
    if (!data.confirmPassword) {
      setCanPass(false);
      return;
    }
    if (!data.isAgreeChecked) {
      setCanPass(false);
      return;
    }
    if (data.password.length < 8) {
      setCanPass(false);
      return;
    }
    if (data.password !== data.confirmPassword) {
      setCanPass(false);
      return;
    }
    setCanPass(true);
  };

  const onCreatePassword = () => {
    setTempPassword(
      password,
      () => {
        setLoading(true);
      },
      () => {
        setLoading(false);
        navigate('/create-wallet/secure-wallet');
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      {tempLoading ? (
        <LoadingScreen />
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
                      onClick={() => {
                        setCreatePasswordModalVisible(false);
                      }}
                      text={'No, try again.'}
                    />
                    <SecondaryButton
                      onClick={() => {
                        onCreatePassword();
                      }}
                      className="mt-1"
                      text="Yes, I am sure."
                      enableFlag={!loading}
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
                    navigate('/initialize/wallet-setup');
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
                <div className="flex-fill">
                  <Bars total={3} current={0} />
                </div>
                <span className="ml-2" style={{ color: colors.grey13 }}>
                  1/3
                </span>
              </div>
              <div>
                <GradientText fontSize={'18px'} fontWeight="bold">
                  Create Password
                </GradientText>
              </div>
              <div
                className="text-center mt-2 mb-4"
                style={{ color: colors.grey9 }}
              >
                This password will unlock your Metamask wallet only on this
                service
              </div>
              <div>
                <PasswordInput
                  value={password}
                  onChangeValue={(value) => {
                    setPassword(value);
                    checkCanPass({
                      password: value,
                      confirmPassword,
                      isAgreeChecked,
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
                      isAgreeChecked,
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
              <div className="justify-content-between d-inline-flex align-items-center w-100">
                <FormControlLabel
                  style={{ margin: '0px' }}
                  aria-label="is-agree-checked-label"
                  control={
                    <Checkbox
                      checked={isAgreeChecked}
                      size="large"
                      onChange={(event) => {
                        setIsAgreeChecked(event.target.checked);
                        checkCanPass({
                          password,
                          confirmPassword,
                          isAgreeChecked: event.target.checked,
                        });
                      }}
                      sx={{
                        color: colors.grey13,
                        '&.Mui-checked': {
                          color: colors.primary5,
                        },
                      }}
                    />
                  }
                />
                <div
                  id="is-agree-checked-label"
                  style={{ color: 'white', fontSize: '14px' }}
                  className="text-left"
                >
                  I understand that DeGe cannot recover this password for me.{' '}
                  <span
                    style={{ color: colors.blue5, cursor: 'pointer' }}
                    onClick={() => window.open('http://google.com')}
                  >
                    Learn more
                  </span>
                </div>
              </div>
              <div
                className="mt-4"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column-reverse',
                }}
              >
                <PrimaryButton
                  className="mb-4"
                  text="Create"
                  onClick={() => {
                    if (
                      passwordStrength(password, passwordStrengthCheckOption)
                        .id < 2
                    ) {
                      setCreatePasswordModalVisible(true);
                      return;
                    }
                    onCreatePassword();
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

export default CreatePassword;
