import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// import mui
import { IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';

// import components
import Bars from '../../../components/Bars';
import { colors, fonts } from '../../../styles';
import { PrimaryButton } from '../../../components/Buttons';
import LoadingScreen from '../../../components/LoadingScreen';
import GradientText from '../../../components/GradientText';

//import utils
import { checkTempPasswordAndMnemonic } from '../../../utils/temp';

//import wallet actions
import { createWallet } from '../../../../Background/store/actions/WalletActions';

const Final = ({ createWallet }) => {
  const navigate = useNavigate();
  const [checkLoading, setCheckLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTempPasswordAndMnemonic(
      () => {
        setCheckLoading(true);
      },
      (data) => {
        setCheckLoading(false);
        setPassword(data.password);
        setMnemonic(data.mnemonic);
      },
      () => {
        navigate('/create-wallet/create-password');
      }
    );
    return () => {};
  }, []);

  const onSuccess = () => {
    createWallet(
      {
        password,
        mnemonic: mnemonic,
      },
      () => {
        setLoading(true);
      },
      () => {
        setLoading(false);
        navigate('/wallet');
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      {checkLoading ? (
        <LoadingScreen />
      ) : (
        <div className="vh-100">
          <div className="pt-4 text-center display-v-h-center h-100">
            <div className="col-lg-4 col-md-5 col-sm-6 col-xs-8 ml-2 mr-2 h-100 mb-5 d-flex flex-column">
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
                <div className="flex-fill">
                  <Bars total={3} current={2} />
                </div>
                <span className="ml-2" style={{ color: colors.grey13 }}>
                  3/3
                </span>
              </div>
              <div className="flex-fill display-v-h-center">
                <div>
                  <GradientText fontSize={'45px'}>Success!</GradientText>
                  <div className="mt-4 text-white">
                    You've successfully protected your wallet. Remember to keep
                    your seed phrase safe, it's your responsibility!
                  </div>
                  <div className="mt-4 text-white">
                    DefiSquid cannot recover your wallet should you lose it. You
                    can find your seedphrase in Setings &gt; Security &amp;
                    Privacy
                  </div>
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
                  text="Next"
                  onClick={() => {
                    onSuccess();
                  }}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  createWallet: (data, beforeWork, successCallback, failCallback) =>
    createWallet(dispatch, data, beforeWork, successCallback, failCallback),
});

export default connect(mapStateToProps, mapDispatchToProps)(Final);
