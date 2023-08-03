import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';

//import navigate
import { useNavigate } from 'react-router-dom';

// import components
import Dots from '../../components/Dots';

//import style
import { colors } from '../../styles';

//import images
const imageList = [
  './assets/images/screens/through/image1.png',
  './assets/images/screens/through/image2.png',
  './assets/images/screens/through/image3.png',
  './assets/images/screens/through/image4.png',
];

const titleImageList = [
  './assets/images/screens/through/title1.png',
  './assets/images/screens/through/title2.png',
  './assets/images/screens/through/title3.png',
  './assets/images/screens/through/title4.png',
];

const Initialize = ({ step }) => {
  const navigate = useNavigate();

  const renderStep0 = () => {
    return (
      <div
        className="text-center h-100 mb-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <img src={imageList[0]} />
        </div>
        <div>
          <img src={titleImageList[0]} />
        </div>
        <div>
          <Dots
            activeColor={colors.primary5}
            inActiveColor={colors.grey18}
            current={step}
            totalCount={imageList.length}
          />
          <SecondaryButton
            className="mt-3"
            text={'Next'}
            onClick={() => {
              navigate('/initialize/safe-and-convenient');
            }}
          />
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div
        className="text-center h-100 mb-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <img src={imageList[1]} />
        </div>
        <div>
          <img src={titleImageList[1]} />
        </div>
        <div>
          <Dots
            activeColor={colors.primary5}
            inActiveColor={colors.grey18}
            current={step}
            totalCount={imageList.length}
          />
          <SecondaryButton
            className="mt-3"
            text={'Next'}
            onClick={() => {
              navigate('/initialize/convenient-transaction');
            }}
          />
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div
        className="text-center h-100 mb-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <img src={imageList[2]} />
        </div>
        <div>
          <img src={titleImageList[2]} />
        </div>
        <div>
          <Dots
            activeColor={colors.primary5}
            inActiveColor={colors.grey18}
            current={step}
            totalCount={imageList.length}
          />
          <SecondaryButton
            className="mt-3"
            text={'Next'}
            onClick={() => {
              navigate('/initialize/wallet-setup');
            }}
          />
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div
        className="text-center h-100 mb-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <img src={imageList[3]} />
        </div>
        <div>
          <img src={titleImageList[3]} />
        </div>
        <div>
          <Dots
            activeColor={colors.primary5}
            inActiveColor={colors.grey18}
            current={step}
            totalCount={imageList.length}
          />
          <SecondaryButton
            className="mt-3"
            text={'Import Wallet'}
            onClick={() => {
              navigate('/import-wallet');
            }}
          />
          <PrimaryButton
            className="mt-2"
            text={'Create Wallet'}
            onClick={() => {
              navigate('/create-wallet');
            }}
          />
        </div>
      </div>
    );
  };
  console.log('Initial Page');
  return (
    <div className="vh-100 display-v-h-center">
      {step === 0 && renderStep0()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default Initialize;
