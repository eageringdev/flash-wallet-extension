import React, { useState } from 'react';

//import components
import PasswordInput from '../../../../../components/CustomInputs/PasswordInput';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../../components/Buttons';
import { Box, Modal } from '@mui/material';
import { modalStyle } from '../../../../../styles/mui/muiStyles';
import { Check } from '@mui/icons-material';

//import utils
import { checkAuthentication } from '../../../../../utils/auth';

//import constants
import Constants from '../../../../../constants';
const passwordStrengthCheckOption = Constants.passwordStrengthCheckOption;
const passwordLevelColor = Constants.passwordLevelColor;

import { passwordStrength } from 'check-password-strength';

//import styles
import { colors, fonts } from '../../../../../styles';

const ChangePassword = ({ onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [canPass, setCanPass] = useState(false);
  const [passwordStrengthLabel, setPasswordStrengthLabel] =
    useState('No Password');
  const [createPasswordModalVisible, setCreatePasswordModalVisible] =
    useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState('confirm');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');

  const checkCanPass = (data) => {
    if (!data.password) {
      setCanPass(false);
      return;
    }
    if (!data.confirmPassword) {
      setCanPass(false);
      return;
    }
    setCanPass(true);
  };

  const onConfirm = () => {
    checkAuthentication(
      currentPassword,
      () => {
        setConfirmLoading(true);
      },
      () => {
        setConfirmLoading(false);
        setStep('set');
      },
      () => {
        setConfirmLoading(false);
        setConfirmError('Password is not correct.');
      },
      () => {
        setConfirmLoading(false);
        setConfirmError('Something went wrong.');
      }
    );
  };

  const onChangePassword = () => {
    setLoading(true);
    changePassword(
      password,
      () => {
        setLoading(false);
        onSuccess();
      },
      () => {
        setLoading(false);
        setError('Something is wrong.');
      }
    );
  };

  const renderConfirmStep = () => {
    return (
      <div
        className="ml-2 mr-2 d-flex flex-column"
        style={{
          minHeight: '320px',
        }}
      >
        <div className="flex-fill">
          <div
            className="mt-1 font-weight-bold text-white text-center"
            style={
              {
                //   ...fonts.title2,
              }
            }
          >
            Confirm password
          </div>
          <div className="mt-5">
            <PasswordInput
              value={currentPassword}
              onChangeValue={(value) => {
                setCurrentPassword(value);
                if (confirmError.length > 0) {
                  setConfirmError('');
                }
              }}
              label={'Current Password'}
            />
            {confirmError.length > 0 && (
              <div
                className="ml-2 mt-1"
                style={{
                  //   ...fonts.caption_small12_16_regular,
                  color: colors.red5,
                }}
              >
                {confirmError}
              </div>
            )}
          </div>
        </div>
        <div className="mb-3 mt-3">
          <PrimaryButton
            text="Confirm"
            onClick={() => {
              onConfirm();
            }}
            enableFlag={currentPassword.length > 0}
            loading={confirmLoading}
          />
        </div>
      </div>
    );
  };

  const renderSetStep = () => {
    return (
      <div
        className="d-flex flex-column"
        style={{
          minHeight: '320px',
        }}
      >
        <div className="ml-2 mr-2 flex-fill">
          <Modal
            open={createPasswordModalVisible}
            onClose={() => {}}
            aria-describedby="password-strength-modal-description"
          >
            <Box sx={modalStyle}>
              <div id="password-strength-modal-description" sx={{ mt: 2 }}>
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
                      onChangePassword();
                    }}
                    style={{ width: 200 }}
                    text="Yes, I am sure."
                    loading={loading}
                  />
                </div>
              </div>
            </Box>
          </Modal>
          <div
            className="mt-1 text-white text-center font-weight-bold"
            style={
              {
                //   ...fonts.title2,
              }
            }
          >
            Change Password
          </div>
          <div>
            <PasswordInput
              value={password}
              onChangeValue={(value) => {
                setPassword(value);
                checkCanPass({ password: value, passwordConfirm });
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
          {error.length > 0 && (
            <div
              className="p-2 mt-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error}
            </div>
          )}
        </div>
        <div className="ml-2 mr-2 mb-3">
          <SecondaryButton
            enableFlag={canPass}
            onClick={() => {
              if (
                passwordStrength(password, passwordStrengthCheckOption).id < 2
              ) {
                setCreatePasswordModalVisible(true);
                return;
              } else {
                onChangePassword();
              }
            }}
            text="Change"
            loading={loading}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {step === 'confirm' && renderConfirmStep()}
      {step === 'set' && renderSetStep()}
    </>
  );
};

export default ChangePassword;
