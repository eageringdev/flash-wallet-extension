import React, { useState } from 'react';
import { connect } from 'react-redux';
import { utils } from 'ethers';

// import components
import { NetworkFeeEthereumModal } from '../../../../components/NetworkFeeModal';
import SlippageModal from '../../SlippageModal';

//import actions
import {
  getFeeData,
  setGettingFeeDataTimerId,
} from '../../../../../Background/store/actions/EngineActions';

//import constants
import { gettingFeeDataTimerInterval } from '../../../../engine/constants';

//import styles
import { colors, fonts } from '../../../../styles';
import { Box, Button, Divider, Modal } from '@mui/material';
import { modalStyle } from '../../../../styles/mui/muiStyles';

const SwapConfirmEthereum = ({
  accounts,
  currentAccountIndex,
  networks,
  currentNetwork,
  swapData,
  feeData,
  getFeeData,
  setGettingFeeDataTimerId,
  gettingFeeDataTimerId,
  setSlippage,
}) => {
  const { fromToken, toToken, fromValue, toValue, inversePrice } = swapData;
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const [showNetworkFeeModal, setShowNetworkFeeModal] = useState(false);

  const [networkFeeType, setNetworkFeeType] = useState('medium');
  const [maxFee, setMaxFee] = useState(feeData.medium.maxFeePerGas);
  const [maxPriorityFee, setMaxPriorityFee] = useState(
    feeData.medium.maxPriorityFeePerGas
  );

  const [gasLimit, setGasLimit] = useState('200000');
  // const [fetchingGasLimit, setFetchingGasLimit] = useState(false);

  const currentAccount = accounts[currentAccountIndex];

  const renderSlippageModal = () => {
    return (
      <Modal
        open={showSlippageModal}
        onClose={() => {
          setShowSlippageModal(false);
        }}
        aria-describedby="slippage-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="slippage-modal-description" className="mt-2">
            <SlippageModal
              slippage={swapData.slippage}
              onSaveSlippage={(value) => {
                setSlippage(value);
                // getEstimatedGasLimit();
                setShowSlippageModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const renderNetworkFeeModal = () => {
    return (
      <Modal
        open={showNetworkFeeModal}
        onClose={() => {
          setShowNetworkFeeModal(false);
        }}
        aria-describedby="network-fee-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="network-fee-modal-description" className="mt-2">
            <NetworkFeeEthereumModal
              networkFeeType={networkFeeType}
              maxFee={maxFee}
              maxPriorityFee={maxPriorityFee}
              gasLimit={gasLimit}
              onSave={({ type, data }) => {
                if (type !== 'advanced') {
                  setNetworkFeeType(type);
                  setMaxFee(feeData[type].maxFeePerGas);
                  setMaxPriorityFee(feeData[type].maxPriorityFeePerGas);
                  setGasLimit(parseInt(data.gasLimit));
                } else {
                  setNetworkFeeType('advanced');
                  setMaxFee(utils.parseUnits(data.maxFee, 'gwei'));
                  setMaxPriorityFee(
                    utils.parseUnits(data.maxPriorityFee, 'gwei')
                  );
                  setGasLimit(parseInt(data.gasLimit));
                }
                setShowNetworkFeeModal(false);
              }}
            />
          </div>
        </Box>
      </Modal>
    );
  };

  const totalFee = parseFloat(utils.formatEther(maxFee)) * parseFloat(gasLimit);

  console.log(totalFee);

  return (
    <div className="mt-5 ml-2 mr-2">
      {renderSlippageModal()}
      {renderNetworkFeeModal()}
      <div className="p-2 d-flex flex-row align-items-center">
        <div
          className="text-white mr-2"
          style={
            {
              //  ...fonts.para_regular,
            }
          }
        >
          Slippage tolerance
        </div>
        <Button
          onClick={() => {
            setShowSlippageModal(true);
          }}
        >
          <div
            className="font-weight-bold"
            style={{
              //   ...fonts.para_semibold,
              color: colors.primary5,
            }}
          >
            Edit
          </div>
        </Button>
        <div
          className="flex-fill text-white text-right"
          style={
            {
              // ...fonts.para_regular
            }
          }
        >
          {swapData.slippage + '%'}
        </div>
      </div>
      <Divider
        className="mt-2 mb-2 ml-4 mr-4"
        style={{ backgroundColor: colors.grey9 }}
      />
      <div className="d-flex flex-row align-items-center p-2">
        <div
          className="flex-fill text-left text-white"
          style={
            {
              //  ...fonts.para_regular,
            }
          }
        >
          Rate
        </div>
        <div
          className="text-white ml-3 text-right"
          style={
            {
              // ...fonts.para_regular
            }
          }
        >
          {fromValue.toString() +
            ' ' +
            (fromToken == 'main'
              ? currentNetworkSymbol
              : fromToken.tokenSymbol) +
            ' = ' +
            toValue.toString() +
            ' ' +
            (toToken == 'main' ? currentNetworkSymbol : toToken.tokenSymbol)}
        </div>
      </div>
      <Divider
        className="mt-2 mb-2 ml-4 mr-4"
        style={{ backgroundColor: colors.grey9 }}
      />
      <div className="d-flex flex-row align-items-center p-2">
        <div
          className="flex-fill text-white text-left"
          style={
            {
              // ...fonts.para_regular,
            }
          }
        >
          Inverse Rate
        </div>
        <div
          className="text-white ml-3 text-right"
          style={
            {
              // ...fonts.para_regular
            }
          }
        >
          {'1 ' +
            (toToken == 'main' ? currentNetworkSymbol : toToken.tokenSymbol) +
            ' = ' +
            inversePrice.toString() +
            ' ' +
            (fromToken == 'main'
              ? currentNetworkSymbol
              : fromToken.tokenSymbol)}
        </div>
      </div>
      <Divider
        className="mt-2 mb-2 ml-4 mr-4"
        style={{ backgroundColor: colors.grey9 }}
      />
      <div className="d-flex flex-row align-items-center p-2">
        <div
          className="flex-fill text-white text-left"
          style={
            {
              //  ...fonts.para_regular,
            }
          }
        >
          USD Price
        </div>
        <div
          className="text-white ml-3 text-right"
          style={
            {
              // ...fonts.para_regular
            }
          }
        >
          {'1 ' +
            (fromToken == 'main'
              ? currentNetworkSymbol
              : fromToken.tokenSymbol) +
            ' = ' +
            '$ 1284.53'}
        </div>
      </div>
      <Divider
        className="mt-2 mb-2 ml-4 mr-4"
        style={{ backgroundColor: colors.grey9 }}
      />
      <div className="d-flex flex-row align-items-center p-2">
        <div
          className="text-white mr-2"
          style={
            {
              // ...fonts.para_regular,
            }
          }
        >
          Estimated Fee
        </div>
        <Button
          onClick={() => {
            setShowNetworkFeeModal(true);
          }}
        >
          <div
            className="font-weight-bold"
            style={{
              //   ...fonts.para_semibold,
              color: colors.primary5,
            }}
          >
            Edit
          </div>
        </Button>
        <div
          className="flex-fill ml-3 text-white text-right"
          style={
            {
              // ...fonts.para_regular
            }
          }
        >
          {totalFee.toFixed(6) + ' ' + currentNetworkSymbol}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  tokens: state.tokens.tokensData,
  feeData: state.engine.feeData,
  gettingFeeDataTimerId: state.engine.gettingFeeDataTimerId,
});
const mapDispatchToProps = (dispatch) => ({
  getFeeData: (currentNetworkObject) =>
    getFeeData(dispatch, currentNetworkObject),
  setGettingFeeDataTimerId: (timerId) =>
    setGettingFeeDataTimerId(dispatch, timerId),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwapConfirmEthereum);
