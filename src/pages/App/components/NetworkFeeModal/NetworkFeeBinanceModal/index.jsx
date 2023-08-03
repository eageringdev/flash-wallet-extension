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

const NetworkFeeBinanceModal = (props) => {
  const tabStyles = useTabStyles();
  const tabsStyles = useTabsStyle();

  const [tabValue, setTabValue] = useState(
    props.networkFeeType === 'advanced' ? 'advanced' : 'basic'
  );

  const { onSave, feeData } = props;
  const propsGasPrice = utils.formatUnits(props.gasPrice, 'gwei');
  const propsGasLimit = props.gasLimit.toString();
  const [networkFeeType, setNetworkFeeType] = useState(props.networkFeeType);
  const { networks, currentNetwork } = props;

  const [gasLimit, setGasLimit] = useState(propsGasLimit);
  const [gasPrice, setGasPrice] = useState(propsGasPrice);
  const [error, setError] = useState({});

  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const onClickSave = () => {
    if (Number(gasLimit) !== parseInt(gasLimit)) {
      setError({ ...error, gasLimit: 'Must be valid Integer.' });
      return;
    }
    if (Number(gasPrice) !== Number(gasPrice)) {
      setError({ ...error, gasPrice: 'Must be valid Number.' });
      return;
    }

    if (Number(gasPrice) === 0) {
      setError({ ...error, gasPrice: 'Must be bigger than 0.' });
      return;
    }

    if (Number(gasLimit) < transferETHGasLimit) {
      setError({ ...error, gasLimit: 'Must be bigger than 21000.' });
      return;
    }

    if (tabValue === 'basic') {
      onSave({ type: networkFeeType, data: { gasLimit } });
    } else if (tabValue === 'advanced') {
      onSave({
        type: 'advanced',
        data: {
          gasLimit,
          gasPrice,
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
                parseFloat(utils.formatEther(feeData.low.gasPrice || '0')) *
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
                parseFloat(utils.formatEther(feeData.medium.gasPrice || '0')) *
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
                parseFloat(utils.formatEther(feeData.high.gasPrice || '0')) *
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
                  utils.parseUnits(
                    parseFloat(gasPrice || '0').toFixed(9),
                    'gwei'
                  )
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
            value={gasPrice}
            label="Gas Price (GWEI)"
            onChangeValue={(value) => {
              setError({ ...error, gasPrice: undefined });
              setGasPrice(value);
            }}
          />
          {error.gasPrice && (
            <div
              className="ml-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {error.gasPrice}
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
              gasPrice.length > 0)
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
)(NetworkFeeBinanceModal);
