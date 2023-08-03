import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import mui
import { Backdrop, Button, IconButton } from '@mui/material';
import { KeyboardArrowLeft, Visibility } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// import components
import Bars from '../../../components/Bars';
import { colors, fonts } from '../../../styles';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import LoadingScreen from '../../../components/LoadingScreen';
import GradientText from '../../../components/GradientText';

//import utils
import { checkTempPasswordAndMnemonic } from '../../../utils/temp';

const testNumbers = [
  1 + Math.floor(Math.random() * 4),
  5 + Math.floor(Math.random() * 4),
  9 + Math.floor(Math.random() * 4),
];

const getNearNumbers = (num) => {
  let t = [],
    res = [];
  if (num < 5) {
    t.push(
      1,
      2,
      3,
      4,
      5 + Math.floor(Math.random() * 4),
      9 + Math.floor(Math.random() * 4)
    );
  } else if (num < 9) {
    t.push(
      5,
      6,
      7,
      8,
      9 + Math.floor(Math.random() * 4),
      1 + Math.floor(Math.random() * 4)
    );
  } else if (num < 13) {
    t.push(
      9,
      10,
      11,
      12,
      1 + Math.floor(Math.random() * 4),
      5 + Math.floor(Math.random() * 4)
    );
  }
  while (t.length) {
    let idx = Math.floor(Math.random() * t.length);
    res.push(t[idx]);
    t.splice(idx, 1);
  }
  return res;
};

const testNumbersCandidates = [
  getNearNumbers(testNumbers[0]),
  getNearNumbers(testNumbers[1]),
  getNearNumbers(testNumbers[2]),
];

const CheckSeed = () => {
  const navigate = useNavigate();
  const [checkLoading, setCheckLoading] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState([]);
  const [step, setStep] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [curAns, setCurAns] = useState('');

  useEffect(() => {
    checkTempPasswordAndMnemonic(
      () => {
        setCheckLoading(true);
      },
      (data) => {
        setCheckLoading(false);
        setMnemonic(data.mnemonic.split(' '));
      },
      () => {
        navigate('/create-wallet/create-password');
      }
    );
    return () => {};
  }, []);

  const onCheckSuccess = () => {
    navigate('/create-wallet/final');
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
              <div className="text-center mt-4">
                <GradientText fontSize={'18px'} fontWeight={'bold'}>
                  Confirm Seed Phrase
                </GradientText>
              </div>
              <div
                className="mt-4"
                style={{
                  // ...fonts.para_regular,
                  color: colors.grey9,
                }}
              >
                Select each word in the order it was presented to you
              </div>
              <div
                className="mt-5 align-items-center justify-content-center"
                style={{
                  height: 250,
                }}
              >
                {curAns ? (
                  <GradientText fontSize={'40px'}>
                    {testNumbers[step] + '. ' + curAns}
                  </GradientText>
                ) : (
                  <p
                    style={{
                      color: colors.grey12,
                      fontSize: '40px',
                      fontWeight: 'bold',
                      // ...fonts.big_type1
                    }}
                  >
                    {testNumbers[step] + '.'}
                  </p>
                )}
              </div>
              <div className="display-v-h-center">
                <div className="w-50">
                  <Bars current={step} total={3} />
                </div>
              </div>

              <div
                className="mt-4 ml-2 mr-2 d-flex flex-wrap flex-row p-2 align-items-center justify-content-center"
                style={{
                  borderColor: colors.grey22,
                  borderWidth: '1px',
                }}
              >
                {testNumbersCandidates[step].map((item, index) => {
                  return (
                    <Button
                      className="pl-2 pr-2 pt-1 pb-1 m-1"
                      key={'check_seed_' + index}
                      onClick={() => {
                        setCurAns(mnemonic[item - 1]);
                        if (item === testNumbers[step]) {
                          setIsCorrect(true);
                        } else {
                          setIsCorrect(false);
                        }
                      }}
                      style={{
                        backgroundColor: colors.grey22,
                        borderRadius: '8px',
                      }}
                    >
                      <span
                        style={{
                          // ...fonts.para_regular,
                          color: 'white',
                        }}
                      >
                        {mnemonic[item - 1]}
                      </span>
                    </Button>
                  );
                })}
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
                  enableFlag={isCorrect}
                  text="Next"
                  onClick={() => {
                    if (step === 2) {
                      onCheckSuccess();
                    } else {
                      setIsCorrect(false);
                      setCurAns('');
                      setStep(step + 1);
                    }
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

export default CheckSeed;
