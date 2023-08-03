import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import mui
import { Box, IconButton, Modal } from '@mui/material';
import { KeyboardArrowLeft, Info } from '@mui/icons-material';

// import components
import Bars from '../../../components/Bars';
import { colors, fonts } from '../../../styles';
import { PrimaryButton } from '../../../components/Buttons';
import LoadingScreen from '../../../components/LoadingScreen';
import { checkTempPassword } from '../../../utils/temp';
import GradientText from '../../../components/GradientText';

import { modalStyle } from '../../../styles/mui/muiStyles';

const SecureSeed = () => {
  const navigate = useNavigate();

  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);

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
              open={showSeedModal}
              onClose={() => {
                setShowSeedModal(false);
              }}
              aria-labelledby="seed-modal-title"
              aria-describedby="seed-modal-description"
            >
              <Box sx={modalStyle}>
                <div id="seed-modal-title">
                  <h6 className="font-weight-bold text-center text-white">
                    What is a 'Seed Phrase' ?
                  </h6>
                </div>
                <div
                  id="seed-modal-description"
                  className="text-white"
                  sx={{ mt: 4 }}
                >
                  <p>
                    A seed phrase is a set of twelve words that contains all the
                    information about your wallet, including your funds. It's
                    like a secret code used to access your entire wallet.
                  </p>
                  <p>
                    You must keep your seed phrase secret and safe. If someone
                    gets your seed phrase, they'll gain control over your
                    accounts.
                  </p>
                  <p>
                    Save it in a place where only you can access it. If you lose
                    it, not even MetaMask can help you recover it.
                  </p>
                  <div className=" mt-4">
                    <PrimaryButton
                      className="m-0"
                      onClick={() => {
                        setShowSeedModal(false);
                      }}
                      text="I got it"
                    />
                  </div>
                </div>
              </Box>
            </Modal>
            <Modal
              open={showInfoModal}
              onClose={() => {
                setShowInfoModal(false);
              }}
              aria-labelledby="info-modal-title"
              aria-describedby="info-modal-description"
            >
              <Box sx={modalStyle}>
                <div id="info-modal-title">
                  <h6 className="font-weight-bold text-center text-white">
                    Protect Your Wallet
                  </h6>
                </div>
                <div
                  id="info-modal-description"
                  className="text-white"
                  sx={{ mt: 4 }}
                >
                  <p>
                    Dont’t risk losing your funds. Protect your wallet by saving
                    your seed phrase in a place you trust.
                  </p>
                  <p>
                    It’s the only way to recover your wallet if you get locked
                    out of the app or get a new device.
                  </p>
                  <div className=" mt-4">
                    <PrimaryButton
                      className="m-0"
                      onClick={() => {
                        setShowInfoModal(false);
                      }}
                      text="I got it"
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
              <div className="d-flex flex-row align-items-center mt-4">
                <div className="flex-fill">
                  <GradientText fontSize={'18px'} fontWeight="bold">
                    Secure Your Wallet
                  </GradientText>
                </div>
                <div>
                  <IconButton
                    onClick={() => {
                      setShowInfoModal(true);
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    edge="end"
                  >
                    <Info className="text-white" />
                  </IconButton>
                </div>
              </div>
              <div
                className="text-left"
                style={{
                  // ...fonts.para_regular,
                  color: colors.grey9,
                }}
              >
                Secure your wallet's "
                <span
                  style={{
                    cursor: 'pointer',
                    color: colors.blue5,
                    //  ...fonts.para_semibold
                  }}
                  onClick={() => {
                    setShowSeedModal(true);
                  }}
                >
                  Seed Phrase
                </span>
                "
              </div>
              <div className="mt-4">
                <div className="text-left font-weight-bold text-white">
                  Manual
                </div>
                <div className="mt-2 text-left text-white">
                  Write down your seed phrase on a piece of paper and store in a
                  safe place.
                </div>
                <div className="mt-2 text-left text-white">
                  Security level: Very strong
                </div>
                <div className="col-6 text-left p-0 mt-2">
                  <Bars current={2} total={3} color={colors.green5} />
                </div>
                <div className="mt-3 text-white text-left">
                  Risks are: <br />• You lose it
                  <br />• You forget where you put it
                  <br />• Someone else finds it
                </div>
                <div className="mt-2 text-white text-left">
                  Other options: Doesn't have to be paper!
                </div>
                <div className="mt-2 text-white text-left">
                  Tips:
                  <br />• Store in bank vault
                  <br />• Store in a safe
                  <br />• Store in multiple secret places
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
                  text="Start"
                  onClick={() => {
                    navigate('/create-wallet/write-seed');
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

export default SecureSeed;
