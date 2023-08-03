import React, { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../../../components/Buttons';
import SingleInput from '../../../components/CustomInputs/SingleInput';

// import styles
import { colors, fonts } from '../../../styles';

const SlippageModal = (props) => {
  const { onSaveSlippage } = props;
  const [slippage, setSlippage] = useState(props.slippage.toString());
  const [customSlippage, setCustomSlippage] = useState(
    parseFloat(props.slippage.toString()) !== 1 &&
      parseFloat(props.slippage.toString()) !== 2
      ? props.slippage.toString()
      : ''
  );

  return (
    <div className="d-flex flex-column h-100">
      <div
        className="mt-1 text-white text-center font-weight-bold"
        style={
          {
            //   ...fonts.title2,
          }
        }
      >
        Slippage Tolerance
      </div>
      <div
        className="mt-4 ml-2 mr-2"
        style={{
          color: colors.grey9,
          //   ...fonts.para_regular,
        }}
      >
        If the price changes between the time your order is placed and confirmed
        it's called "slippage". Your swap will automatically cancel if slippage
        exceeds your "max slippage" setting.
        <b>Maximum: 12</b>
      </div>
      <div className="mt-2 d-flex flex-row align-items-center ml-2 mr-2 flex-fill">
        {Number(slippage) === 1 && customSlippage.toString().length == 0 ? (
          <PrimaryButton
            style={{ width: '100px' }}
            className="m-0"
            text={'1%'}
            onClick={() => {}}
          />
        ) : (
          <SecondaryButton
            style={{ width: '100px' }}
            className="m-0"
            text="1%"
            onClick={() => {
              setSlippage('1');
              setCustomSlippage('');
            }}
          />
        )}
        {Number(slippage) === 2 && customSlippage.toString().length == 0 ? (
          <PrimaryButton
            style={{ width: '100px' }}
            className="m-0 ml-2"
            onClick={() => {}}
            text={'2%'}
          />
        ) : (
          <SecondaryButton
            style={{ width: '100px' }}
            className="m-0 ml-2"
            text="2%"
            onClick={() => {
              setSlippage('2');
              setCustomSlippage('');
            }}
          />
        )}
        <SingleInput
          className="ml-2 flex-fill"
          onChangeValue={(value) => setCustomSlippage(value)}
          value={customSlippage}
          placeholder={'Custom'}
          label="Slippage"
        />
      </div>
      <div className="mt-3 mb-3 ml-2 mr-2">
        <PrimaryButton
          text="Save"
          onClick={() => {
            onSaveSlippage(
              customSlippage.toString().length > 0
                ? customSlippage.toString()
                : slippage
            );
          }}
          enableFlag={
            customSlippage.toString().length > 0
              ? Number(customSlippage.toString()) ===
                  parseFloat(customSlippage.toString()) &&
                parseFloat(customSlippage.toString()) <= 12
              : true
          }
        />
      </div>
    </div>
  );
};

export default SlippageModal;
