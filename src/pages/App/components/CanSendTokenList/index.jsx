import React, { useState } from 'react';
import { connect } from 'react-redux';

//import components
import TokenBalanceText from '../TokenBalanceText';
import BalanceText from '../BalanceText';

//import mui
import { Box, Button, Modal } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../styles';
import { modalStyle } from '../../styles/mui/muiStyles';

const CanSendTokenList = ({
  accounts,
  currentAccountIndex,
  tokens,
  onSelectToken,
  selectedToken,
  currentNetwork,
  networks,
  className,
}) => {
  const [showTokenListModal, setShowTokenListModal] = useState(false);

  const tokensList = tokens[currentNetwork.toString()]
    ? tokens[currentNetwork.toString()][currentAccountIndex]
      ? tokens[currentNetwork.toString()][currentAccountIndex].tokensList
      : []
    : [];
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const TokenRow = ({ token, onClick }) => {
    return (
      <Button onClick={onClick} className="w-100">
        <div className="d-flex flex-row align-items-center p-2 w-100">
          <div className="d-flex flex-row align-items-center w-100">
            <div
              className="mr-2"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                backgroundColor: colors.grey23,
              }}
            ></div>
            <div>
              <div
                className="text-white"
                style={
                  {
                    // ...fonts.title2
                  }
                }
              >
                {token.tokenAddress === 'main'
                  ? currentNetworkSymbol
                  : token.tokenSymbol}
              </div>
            </div>
            <div className="d-flex flex-fill flex-row-reverse">
              {token.tokenAddress === 'main' ? (
                <BalanceText
                  address={accounts[currentAccountIndex].address}
                  className="text-white"
                  style={
                    {
                      // ...fonts.title2,
                    }
                  }
                />
              ) : (
                <TokenBalanceText
                  address={accounts[currentAccountIndex].address}
                  token={token}
                  className="text-white"
                  style={
                    {
                      // ...fonts.title2,
                    }
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Button>
    );
  };

  const renderTokensListModal = () => {
    return (
      <Modal
        open={showTokenListModal}
        onClose={() => {
          setShowTokenListModal(false);
        }}
        aria-labelledby="token-list-modal-title"
        aria-describedby="token-list-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="token-list-modal-title">
            <h6 className="font-weight-bold text-center text-white">Token</h6>
          </div>
          <div
            id="token-list-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            <TokenRow
              onClick={() => {
                onSelectToken('main');
                setShowTokenListModal(false);
              }}
              key={'cansendTokenList_main'}
              token={{
                tokenDecimal: 18,
                tokenAddress: 'main',
              }}
            />
            {tokensList.map((token) => (
              <TokenRow
                onClick={() => {
                  onSelectToken(token);
                  setShowTokenListModal(false);
                }}
                key={'cansendTokenList_' + token.tokenAddress}
                token={token}
              />
            ))}
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <div className={'d-flex align-items-center justify-content-center '}>
      <Button
        className={'border ' + className || ''}
        style={{
          borderRadius: '8px',
          borderWidth: '2px !important',
          borderColor: colors.grey9 + ' !important',
        }}
        onClick={() => {
          setShowTokenListModal(true);
        }}
      >
        <div
          className="text-white font-weight-bold flex-fill"
          style={
            {
              // ...fonts.para_semibold
            }
          }
        >
          {selectedToken === 'main'
            ? currentNetworkSymbol
            : selectedToken.tokenSymbol}
        </div>
        <div className="mr-1">
          <KeyboardArrowDown style={{ fontSize: '16px', color: 'white' }} />
        </div>
      </Button>
      {renderTokensListModal()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  tokens: state.tokens.tokensData,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CanSendTokenList);
