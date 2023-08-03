import React, { useState } from 'react';
import { connect } from 'react-redux';

import { useNavigate, Navigate } from 'react-router-dom';

import PasswordInput from '../../components/CustomInputs/PasswordInput';
import CustomSwitch from '../../components/CustomSwitch';
import { PrimaryButton } from '../../components/Buttons';

import { colors } from '../../styles';

// import utils
import { checkAuthentication, saveRememberOption } from '../../utils/auth';

//import actions
import { setWalletData } from '../../../Background/store/actions/WalletActions';

const Login = ({ setWalletData, walletInfo }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogIn = () => {
    checkAuthentication(
      password,
      () => {
        setLoading(true);
      },
      () => {
        saveRememberOption(
          rememberMe,
          () => {},
          () => {
            setLoading(false);
            setWalletData({
              isLocked: false,
              isInitialized: true,
            });
            navigate('/wallet');
          },
          () => {
            setLoading(false);
            setError('Something went wrong.');
          }
        );
      },
      () => {
        setLoading(false);
        setError('Password is wrong.');
      },
      () => {
        setLoading(false);
        setError('Something went wrong');
      }
    );
  };

  return (
    <>
      {walletInfo.isLocked ? (
        <div className="vh-100">
          <div className="pt-4 text-center display-v-h-center h-100">
            <div>
              <div>
                <img src="./assets/images/logo.png" />
              </div>
              <div className="mt-5">
                <PasswordInput
                  value={password}
                  onChangeValue={(value) => {
                    if (error.length) {
                      setError('');
                    }
                    setPassword(value);
                  }}
                  label={'New Password'}
                />
              </div>
              {error.length > 0 && (
                <div
                  className="pl-2 text-left"
                  style={{
                    // ...fonts.caption_small12_16_regular,
                    color: colors.red5,
                  }}
                >
                  {error}
                </div>
              )}
              <div className="justify-content-between d-inline-flex align-items-center w-100 mt-1 pl-2 pr-2">
                <div className="text-white">Remember Me</div>
                <CustomSwitch
                  checked={rememberMe}
                  onChange={(event) => {
                    setRememberMe(event.target.checked);
                  }}
                />
              </div>
              <div className="mt-4">
                <PrimaryButton
                  text="Log In"
                  onClick={() => {
                    setError('');
                    onLogIn();
                  }}
                  loading={loading}
                  enableFlag={password.length > 0}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/wallet" />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  walletInfo: state.wallet,
});
const mapDispatchToProps = (dispatch) => ({
  setWalletData: (data) => setWalletData(dispatch, data),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
