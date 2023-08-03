import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import mui
import { Box, Checkbox, IconButton, Modal } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';

// import components
import Bars from '../../../components/Bars';
import { colors } from '../../../styles';
import { useEffect } from 'react';
import { checkTempPassword } from '../../../utils/temp';
import LoadingScreen from '../../../components/LoadingScreen';
import TextButton from '../../../components/Buttons/TextButton';
import { PrimaryButton } from '../../../components/Buttons';

import { modalStyle } from '../../../styles/mui/muiStyles';

const SecureWallet = () => {
  const navigate = useNavigate();

  const [checkLoading, setCheckLoading] = useState(false);
  const [understandNotSecurity, setUnderstandNotSecurity] = useState(false);

  const [skipModalShow, setSkipModalShow] = useState(false);

  useEffect(() => {
    checkTempPassword(
      () => {
        setCheckLoading(true);
      },
      () => {
        setCheckLoading(false);
      },
      () => {
        navigate('/create-wallet/create-password');
      }
    );
  }, []);

  return (
    <>
      {checkLoading ? (
        <LoadingScreen />
      ) : (
        <div className="vh-100">
          <div className="pt-4 text-center display-v-h-center h-100">
            <Modal
              open={skipModalShow}
              onClose={() => {
                setSkipModalShow(false);
              }}
              aria-labelledby="skip-modal-title"
              aria-describedby="skip-modal-description"
            >
              <Box sx={modalStyle}>
                <div id="skip-modal-title">
                  <h6 className="font-weight-bold text-center text-white">
                    Skip Account Security?
                  </h6>
                </div>
                <div id="skip-modal-description" sx={{ mt: 4 }}>
                  <div className="d-flex flex-row align-items-center">
                    <Checkbox
                      checked={understandNotSecurity}
                      size="large"
                      onChange={(event) => {
                        setUnderstandNotSecurity(event.target.checked);
                      }}
                      sx={{
                        color: colors.grey13,
                        '&.Mui-checked': {
                          color: colors.primary5,
                        },
                      }}
                    />
                    <span
                      style={{ fontSize: '14px' }}
                      className="text-left text-white ml-2"
                    >
                      I understand that DeGe cannot recover this password for
                      me.{' '}
                      <span style={{ color: colors.blue5, cursor: 'pointer' }}>
                        Learn more
                      </span>
                    </span>
                  </div>
                  <div className="d-flex flex-row justify-content-around align-items-center mt-4">
                    <TextButton
                      className="m-0"
                      onClick={() => {
                        setSkipModalShow(false);
                      }}
                      text={'Secure Now'}
                    />
                    <PrimaryButton
                      enableFlag={understandNotSecurity}
                      className="m-0"
                      onClick={() => {}}
                      text="Skip"
                    />
                  </div>
                </div>
              </Box>
            </Modal>
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
                  <Bars total={3} current={1} />
                </div>
                <span className="ml-2" style={{ color: colors.grey13 }}>
                  2/3
                </span>
              </div>
              <div>
                <img src="./assets/images/screens/create-wallet/secure-wallet/secure.png" />
              </div>
              <div className="mt-2">
                <h4 className="text-center text-white">Secure Wallet</h4>
                <div style={{ color: colors.grey9 }} className="text-left">
                  Don't risk losing your funds. Protect your wallet by saving
                  your{' '}
                  <span
                    style={{
                      color: colors.blue5,
                      //  ...fonts.para_semibold
                    }}
                    onClick={() => {}}
                  >
                    Seed Phrase
                  </span>{' '}
                  in a place you trust.
                </div>
                <div
                  style={{ color: colors.grey9 }}
                  className="font-weight-bold text-left"
                >
                  It's the only way to recover your wallet if you get locked out
                  of the app or get a new device.
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
                  className="mt-2 mb-4"
                  text="Next"
                  onClick={() => {
                    navigate('/create-wallet/secure-seed');
                  }}
                />
                <TextButton
                  text="Remind Me Later"
                  onClick={() => {
                    setSkipModalShow(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecureWallet;
