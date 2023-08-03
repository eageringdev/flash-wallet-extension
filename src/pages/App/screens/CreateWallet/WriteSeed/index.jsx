import React, { useState, useEffect } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';

// import mui
import { Backdrop, IconButton } from '@mui/material';
import { KeyboardArrowLeft, Visibility } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// import components
import Bars from '../../../components/Bars';
import { colors, fonts } from '../../../styles';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import LoadingScreen from '../../../components/LoadingScreen';

const useBlurStyles = makeStyles({
  blurParent: {
    position: 'relative',
    zIndex: 0,
  },
  backdrop: {
    position: 'absolute !important',
    backdropFilter: 'blur(5px)',
  },
});

//import utils
import { checkTempPassword, setTempMnemonic } from '../../../utils/temp';
import { createMnemonic } from '../../../utils/mnemonic';
import GradientText from '../../../components/GradientText';

const WriteSeed = () => {
  const navigate = useNavigate();
  const blurClasses = useBlurStyles();

  const [checkLoading, setCheckLoading] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState([]);

  useEffect(() => {
    checkTempPassword(
      () => {
        setCheckLoading(true);
      },
      () => {
        setCheckLoading(false);
        setTempMnemonic(
          '',
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
      },
      () => {
        navigate('/create-wallet/create-password');
      }
    );

    let phrase = createMnemonic();
    phrase = phrase.split(' ');
    setMnemonic(phrase);
    console.log(phrase);
    return () => {};
  }, []);

  const onStart = () => {
    setTempMnemonic(
      mnemonic.join(' '),
      () => {
        setLoading(true);
      },
      () => {
        setLoading(false);
        navigate('/create-wallet/check-seed');
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
                  <Bars total={3} current={1} />
                </div>
                <span className="ml-2" style={{ color: colors.grey13 }}>
                  2/3
                </span>
              </div>
              <div className="text-center mt-4">
                <GradientText fontSize={'18px'} fontWeight="bold">
                  Write Seed
                </GradientText>
              </div>
              <div
                className="text-left mt-4"
                style={{
                  // ...fonts.para_regular,
                  color: colors.grey9,
                }}
              >
                This is your seed phrase. Write it down on a paper and keep it
                in a safe place. You'll be asked to re-enter this phrase (in
                order) on the next step.
              </div>

              <div className={blurClasses.blurParent + ' mt-3 p-3'}>
                {mnemonic.map((item, index) => {
                  if (index < 6) {
                    return (
                      <div
                        className="d-flex mb-2 justify-content-around"
                        key={'mnemonic_' + index}
                      >
                        <div
                          className="mr-1"
                          style={{
                            backgroundColor: colors.grey22,
                            borderRadius: 8,
                            height: 32,
                            width: 140,
                          }}
                        >
                          <p
                            className="text-white text-center"
                            style={
                              {
                                // ...fonts.para_regular,
                              }
                            }
                          >
                            {(index + 1).toString() + '. ' + item}
                          </p>
                        </div>
                        <div
                          className="ml-1"
                          style={{
                            backgroundColor: colors.grey22,
                            borderRadius: 8,
                            height: 32,
                            width: 140,
                          }}
                        >
                          <p
                            className="text-white text-center"
                            style={
                              {
                                // ...fonts.para_regular,
                              }
                            }
                          >
                            {(index + 7).toString() +
                              '. ' +
                              mnemonic[index + 6]}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })}
                {!showSeedPhrase && (
                  <Backdrop
                    style={{
                      borderRadius: '8px',
                      backgroundColor: colors.grey9 + '64 !important',
                    }}
                    className={blurClasses.backdrop + ' display-v-h-center'}
                    open={true}
                  >
                    <SecondaryButton
                      className="w-50"
                      text="View"
                      onClick={() => {
                        setShowSeedPhrase(true);
                      }}
                      icon={<Visibility style={{ color: colors.primary5 }} />}
                    />
                  </Backdrop>
                )}
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
                  enableFlag={showSeedPhrase}
                  text="Start"
                  onClick={() => {
                    onStart();
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

export default WriteSeed;
