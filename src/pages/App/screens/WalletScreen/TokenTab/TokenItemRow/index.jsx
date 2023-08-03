import React, { useState } from 'react';
import { connect } from 'react-redux';

//import actions
import { removeToken } from '../../../../../Background/store/actions/TokensActions';

//import styles
import { colors, fonts } from '../../../../styles';

//import components
import TokenBalanceText from '../../../../components/TokenBalanceText';
import BalanceText from '../../../../components/BalanceText';
import { PrimaryButton, SecondaryButton } from '../../../../components/Buttons';

//import mui
import { Button, Box, Modal } from '@mui/material';
import { modalStyle } from '../../../../styles/mui/muiStyles';

const TokenItemRow = ({
  token,
  onClick,
  removable,
  accounts,
  currentAccountIndex,
  networks,
  currentNetwork,
  removeToken,
}) => {
  const { tokenSymbol, tokenAddress, tokenDecimal } = token;
  const trend = 1.2;
  const usdAmount = 123;
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const renderRemoveModal = () => {
    return (
      <Modal
        open={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
        }}
        aria-labelledby="remove-modal-title"
        aria-describedby="remove-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="remove-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Do you wanna remove this Token?
            </h6>
          </div>
          <div
            id="remove-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            <div>
              <SecondaryButton
                className="m-0"
                loading={removeLoading}
                onClick={() => {
                  removeToken(
                    { tokenAddress, currentNetwork, currentAccountIndex },
                    () => {
                      setRemoveLoading(true);
                    },
                    () => {},
                    () => {}
                  );
                }}
                text="Remove"
              />
            </div>
            <div className="mt-4">
              <PrimaryButton
                className="m-0"
                onClick={() => {
                  setShowRemoveModal(false);
                }}
                text="Cancel"
              />
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderRemoveModal()}
      <Button
        className="p-1 mt-2 w-100"
        onClick={onClick}
        key={
          token.address ? token.address.toString() : 'currentToken_onTokenShow'
        }
      >
        {token === 'main' ? (
          <div className="d-flex flex-row align-items-center w-100">
            <div
              style={{
                borderRadius: '20px',
                width: '40px',
                height: '40px',
                backgroundColor: colors.grey19,
              }}
            ></div>
            <div className="flex-fill">
              <div className="d-flex flex-row pl-2 pr-2">
                <div className="w-50">
                  <div
                    className="text-left text-white"
                    style={
                      {
                        // ...fonts.title2,
                      }
                    }
                  >
                    {currentNetworkSymbol}
                  </div>
                </div>
                <div className="w-50">
                  <BalanceText
                    address={accounts[currentAccountIndex].address}
                    className="text-white text-right"
                    style={
                      {
                        //   ...fonts.title2,
                      }
                    }
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center pl-2">
                <span
                  style={{
                    // ...fonts.caption_small12_16_regular,
                    color: colors.grey9,
                  }}
                >
                  {'$' + parseFloat(usdAmount).toFixed(2)}
                </span>
                <span
                  className="ml-1"
                  style={{
                    // ...fonts.para_semibold,
                    color: trend > 0 ? colors.green5 : colors.red5,
                  }}
                >
                  {(trend > 0 ? '+' : '') + trend + '%'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-row align-items-center w-100">
            <div
              style={{
                borderRadius: '20px',
                width: '40px',
                height: '40px',
                backgroundColor: colors.grey19,
              }}
            ></div>
            <div className="flex-fill">
              <div className="pl-2 pr-2 d-flex flex-row">
                <div className="w-50">
                  <div
                    className="text-white text-left"
                    style={
                      {
                        // ...fonts.title2,
                      }
                    }
                  >
                    {tokenSymbol}
                  </div>
                </div>
                <div className="w-50">
                  <TokenBalanceText
                    address={accounts[currentAccountIndex].address}
                    token={token}
                    className="text-white text-right"
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center pl-2">
                <span
                  style={{
                    // ...fonts.caption_small12_16_regular,
                    color: colors.grey9,
                  }}
                >
                  {'$' + parseFloat(usdAmount).toFixed(2)}
                </span>
                <span
                  className="ml-1"
                  style={{
                    // ...fonts.para_semibold,
                    color: trend > 0 ? colors.green5 : colors.red5,
                  }}
                >
                  {(trend > 0 ? '+' : '') + trend + '%'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({
  removeToken: (data, beforeWork, successCallback, failCallback) =>
    removeToken(dispatch, data, beforeWork, successCallback, failCallback),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenItemRow);
