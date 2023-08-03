import React, { useState } from 'react';
import { connect } from 'react-redux';
import { utils } from 'ethers';

//import engine constants
import { transferETHGasLimit } from '../../../engine/constants';

//import components
import { PrimaryButton } from '../../Buttons';
import SingleInput from '../../CustomInputs/SingleInput';

//import mui
import { Box, Button, Divider, Tab } from '@mui/material';
import { TabList, TabContext, TabPanel } from '@mui/lab';
import { useTabsStyle, useTabStyles } from '../../../styles/mui/muiStyles';
import { CheckCircle } from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../../styles';

const NetworkFeeEthereumModal = (props) => {
  const tabStyles = useTabStyles();
  const tabsStyles = useTabsStyle();

  const [tabValue, setTabValue] = useState(
    props.networkFeeType === 'advanced' ? 'advanced' : 'basic'
  );

  const { onSave, feeData } = props;
  const propsMaxFee = utils.formatUnits(props.maxFee, 'gwei');
  const propsMaxPriorityFee = utils.formatUnits(props.maxPriorityFee, 'gwei');
  const propsGasLimit = props.gasLimit.toString();
  const [networkFeeType, setNetworkFeeType] = useState(props.networkFeeType);
  const { networks, currentNetwork } = props;

  const [gasLimit, setGasLimit] = useState(propsGasLimit);
  const [maxPriorityFee, setMaxPriorityFee] = useState(propsMaxPriorityFee);
  const [maxFee, setMaxFee] = useState(propsMaxFee);
  const [error, setError] = useState({});

  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const onClickSave = () => {
    if (Number(gasLimit) !== parseInt(gasLimit)) {
      setError({ ...error, gasLimit: 'Must be valid Integer.' });
      return;
    }
    if (Number(maxFee) !== Number(maxFee)) {
      setError({ ...error, maxFee: 'Must be valid Number.' });
      return;
    }
    if (Number(maxPriorityFee) !== Number(maxPriorityFee)) {
      setError({ ...error, maxPriorityFee: 'Must be valid Number.' });
      return;
    }
    if (Number(gasLimit) < transferETHGasLimit) {
      setError({ ...error, gasLimit: 'Must be bigger than 21000.' });
      return;
    }
    if (parseFloat(maxFee) < parseFloat(maxPriorityFee)) {
      setError({
        ...error,
        maxFee: 'Max Fee cannot be lower than Max Priority Fee.',
      });
      return;
    }
    if (
      parseFloat(maxFee) < utils.formatUnits(feeData.low.maxFeePerGas, 'gwei')
    ) {
      setError({
        ...error,
        maxFee: 'Max Fee is lower than the current network condition.',
      });
    }
    if (
      parseFloat(maxPriorityFee) <
      utils.formatUnits(feeData.low.maxPriorityFeePerGas, 'gwei')
    ) {
      setError({
        ...error,
        maxPriorityFee:
          'Max Priority Fee is lower than the current network condition.',
      });
    }
    if (
      parseFloat(maxFee) > utils.formatUnits(feeData.high.maxFeePerGas, 'gwei')
    ) {
      setError({ ...error, maxFee: 'Max Fee is higher than necessary.' });
    }
    if (
      parseFloat(maxPriorityFee) >
      utils.formatUnits(feeData.high.maxPriorityFeePerGas, 'gwei')
    ) {
      setError({
        ...error,
        maxPriorityFee: 'Max Priority Fee is higher than necessary.',
      });
    }
    if (tabValue === 'basic') {
      onSave({ type: networkFeeType, data: { gasLimit } });
    } else if (tabValue === 'advanced') {
      onSave({
        type: 'advanced',
        data: {
          gasLimit,
          maxFee,
          maxPriorityFee,
        },
      });
    }
  };

  const renderBasicTab = () => {
    return (
      <div>
        <div className="mt-2">
          <Button
            className="d-flex flex-row align-items-center w-100"
            onClick={() => {
              setNetworkFeeType('low');
            }}
          >
            <div
              style={{
                width: '30%',
                // ...fonts.title2,
              }}
              className="text-white text-left font-weight-bold"
            >
              Low
            </div>
            <div
              className="text-white font-weight-bold text-right"
              style={{
                width: '50%',
                //   ...fonts.title2,
              }}
            >
              {(
                parseFloat(utils.formatEther(feeData.low.maxFeePerGas)) *
                gasLimit
              ).toFixed(8) +
                ' ' +
                currentNetworkSymbol}
              <div
                style={{
                  // ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                $ 19.23
              </div>
            </div>
            {networkFeeType === 'low' ? (
              <CheckCircle
                style={{
                  width: '20%',
                  fontSize: '18px',
                  color: colors.green5,
                }}
              />
            ) : (
              <div style={{ width: '20%' }}></div>
            )}
          </Button>
          <Divider style={{ backgroundColor: colors.grey9 }} />
          <Button
            className="d-flex flex-row align-items-center w-100"
            onClick={() => {
              setNetworkFeeType('medium');
            }}
          >
            <div
              style={{
                width: '30%',
                // ...fonts.title2,
              }}
              className="text-white text-left font-weight-bold"
            >
              Medium
            </div>
            <div
              className="text-white font-weight-bold text-right"
              style={{
                width: '50%',
                //   ...fonts.title2,
              }}
            >
              {(
                parseFloat(utils.formatEther(feeData.medium.maxFeePerGas)) *
                gasLimit
              ).toFixed(8) +
                ' ' +
                currentNetworkSymbol}
              <div
                style={{
                  // ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                $ 19.23
              </div>
            </div>
            {networkFeeType === 'medium' ? (
              <CheckCircle
                style={{
                  width: '20%',
                  fontSize: '18px',
                  color: colors.green5,
                }}
              />
            ) : (
              <div style={{ width: '20%' }}></div>
            )}
          </Button>
          <Divider style={{ backgroundColor: colors.grey9 }} />
          <Button
            className="d-flex flex-row align-items-center w-100"
            onClick={() => {
              setNetworkFeeType('high');
            }}
          >
            <div
              style={{
                width: '30%',
                // ...fonts.title2,
              }}
              className="text-white text-left font-weight-bold"
            >
              High
            </div>
            <div
              className="text-white font-weight-bold text-right"
              style={{
                width: '50%',
                //   ...fonts.title2,
              }}
            >
              {(
                parseFloat(utils.formatEther(feeData.high.maxFeePerGas)) *
                gasLimit
              ).toFixed(8) +
                ' ' +
                currentNetworkSymbol}
              <div
                style={{
                  // ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                $ 19.23
              </div>
            </div>
            {networkFeeType === 'high' ? (
              <CheckCircle
                style={{
                  width: '20%',
                  fontSize: '18px',
                  color: colors.green5,
                }}
              />
            ) : (
              <div style={{ width: '20%' }}></div>
            )}
          </Button>
        </div>
        <div
          className="mt-2"
          style={{
            // ...fonts.para_regular,
            color: colors.grey9,
          }}
        >
          The network fee covers the cost of processing your transaction on the
          Ethereum network.
        </div>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <div>
        <div className="d-flex flex-row align-items-center mt-2">
          <div
            className="text-white text-left font-weight-bold flex-fill"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            Total
          </div>
          <div
            className="font-weight-bold text-white"
            style={
              {
                // ...fonts.title2
              }
            }
          >
            {(
              parseFloat(
                utils.formatEther(
                  utils.parseUnits(parseFloat(maxFee).toFixed(9), 'gwei')
                )
              ) * gasLimit
            ).toFixed(8) +
              ' ' +
              currentNetworkSymbol}
          </div>
        </div>
        <div className="mt-2">
          <SingleInput
            value={gasLimit}
            label="Gas Limit"
            onChangeValue={(value) => {
              setError({ ...error, gasLimit: undefined });
              setGasLimit(value);
            }}
          />
          {error.gasLimit && (
            <div
              className="ml-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.gasLimit}
            </div>
          )}
        </div>
        <div className="mt-2">
          <SingleInput
            value={maxPriorityFee}
            label="Max Priority Fee (GWEI)"
            onChangeValue={(value) => {
              setError({ ...error, maxPriorityFee: undefined });
              setMaxPriorityFee(value);
            }}
          />
          {error.maxPriorityFee && (
            <div
              className="ml-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.maxPriorityFee}
            </div>
          )}
        </div>
        <div className="mt-2">
          <SingleInput
            value={maxFee}
            label="Max Fee (GWEI)"
            onChangeText={(value) => {
              setError({ ...error, maxFee: undefined });
              setMaxFee(value);
            }}
          />
          {error.maxFee && (
            <div
              className="ml-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.maxFee}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="mt-1 text-center text-white font-weight-bold"
        style={
          {
            // ...fonts.title2
          }
        }
      >
        Edit Network Fee
      </div>
      <Box className="mt-2 w-100 flex-fill overflow-auto">
        <TabContext value={tabValue}>
          <Box>
            <TabList
              onChange={(event, value) => {
                setTabValue(value);
              }}
              classes={tabsStyles}
            >
              <Tab
                label="Basic"
                value="basic"
                style={{
                  color: tabValue === 'basic' ? 'white' : colors.grey12,
                  textTransform: 'initial',
                }}
              />
              <Tab
                label="Advanced"
                value="advanced"
                style={{
                  color: tabValue === 'advanced' ? 'white' : colors.grey12,
                  textTransform: 'initial',
                }}
              />
            </TabList>
          </Box>
          <TabPanel style={{ height: '320px' }} className="p-2" value="basic">
            {renderBasicTab()}
          </TabPanel>
          <TabPanel
            style={{ height: '320px' }}
            className="p-2"
            value="advanced"
          >
            {renderAdvancedTab()}
          </TabPanel>
        </TabContext>
      </Box>
      <div className="pb-2">
        <PrimaryButton
          enableFlag={
            tabValue === 'basic' ||
            (tabValue === 'advanced' &&
              gasLimit.length > 0 &&
              maxFee.length > 0 &&
              maxPriorityFee.length > 0)
          }
          onClick={() => {
            onClickSave();
          }}
          text="Save"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  feeData: state.engine.feeData,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkFeeEthereumModal);
