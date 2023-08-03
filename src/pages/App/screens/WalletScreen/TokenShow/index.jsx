import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import actions
import { setSelectedToken } from '../../../../Background/store/actions/TokensActions';

//import components
import BalanceText from '../../../components/BalanceText';
import TokenBalanceText from '../../../components/TokenBalanceText';
import { SecondaryButton } from '../../../components/Buttons';
import HistoryRow from '../../../components/HistoryRow';

//import mui
import {
  KeyboardArrowLeft,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

//import styles
import { colors, fonts } from '../../../styles';

const tokenBalance = 19.2371;
const usdAmount = 226.69;

const TokenShow = ({
  networks,
  currentNetwork,
  accounts,
  currentAccountIndex,
  selectedToken,
  setSelectedToken,
}) => {
  const navigate = useNavigate();

  const currentNetworkSymbol = networks[currentNetwork].symbol;
  const currentAccount = accounts[currentAccountIndex];

  const renderHeader = () => {
    return (
      <div className="p-2 d-flex flex-row align-items-center">
        <div>
          <IconButton
            onClick={() => {
              setSelectedToken('');
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            style={{ width: '20px' }}
          >
            <KeyboardArrowLeft style={{ fontSize: '16px', color: 'white' }} />
          </IconButton>
        </div>
        <div className="flex-fill text-center text-white">
          {selectedToken === 'main'
            ? currentNetworkSymbol
            : selectedToken.tokenSymbol}
        </div>
      </div>
    );
  };

  const renderNetworkBalance = () => {
    console.log(selectedToken);
    return (
      <>
        {selectedToken === 'main' ? (
          <div className="ml-2 mt-2">
            <div>
              <BalanceText
                gradient={true}
                style={
                  {
                    // ...fonts.big_type1
                  }
                }
                address={currentAccount.address}
              />
            </div>
            <div
              className="mt-2 text-white"
              style={
                {
                  // ...fonts.para_regular
                }
              }
            >
              {'$' +
                parseFloat(tokenBalance * usdAmount)
                  .toFixed(4)
                  .toString()}
            </div>
          </div>
        ) : (
          <div style={{ marginLeft: 24, marginTop: 24 }}>
            <div>
              {selectedToken ? (
                <TokenBalanceText
                  gradient={true}
                  address={currentAccount.address}
                  token={selectedToken}
                  style={{ ...fonts.big_type1 }}
                />
              ) : (
                <></>
              )}
            </div>
            <div
              className="mt-2 text-white"
              style={
                {
                  // ...fonts.para_regular
                }
              }
            >
              {'$' +
                parseFloat(tokenBalance * usdAmount)
                  .toFixed(4)
                  .toString()}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTransactionButtonGroup = () => {
    return (
      <div className="mr-2 ml-2 d-flex flex-row mt-4">
        <div className="mr-1">
          <SecondaryButton
            onClick={() => {
              navigate('/send-token');
            }}
            text="Send"
            icon={
              <ArrowUpward
                style={{
                  fontSize: 16,
                  color: colors.primary5,
                }}
              />
            }
          />
        </div>
        <div>
          <SecondaryButton
            onClick={() => {}}
            text="Receive"
            icon={
              <ArrowDownward
                style={{
                  fontSize: 16,
                  color: colors.primary5,
                }}
              />
            }
          />
        </div>
      </div>
    );
  };

  const renderHistoryPanel = () => {
    return (
      <div className="mt-4 mb-4 ml-2 mr-2 w-100 flex-fill overflow-auto">
        <HistoryRow
          transactionType={'received'}
          resultType="confirmed"
          totalAmount={0.04}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
        <HistoryRow
          transactionType={'sent'}
          resultType="cancelled"
          totalAmount={2.35}
          amount={2.14}
          fee={0.21}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
        <HistoryRow
          transactionType={'received'}
          resultType="confirmed"
          totalAmount={1.876}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
        <HistoryRow
          transactionType={'sent'}
          resultType="cancelled"
          totalAmount={1.12}
          amount={0.99}
          fee={0.23}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
        <HistoryRow
          transactionType={'received'}
          resultType="confirmed"
          totalAmount={2.04}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
        <HistoryRow
          transactionType={'sent'}
          resultType="cancelled"
          totalAmount={0.54}
          amount={0.18}
          fee={0.36}
          unit="BNB"
          from="0x154710078025b92c6C2F01AF950C1DDEb23F7FeB"
          to="0xD5cB0bdA7579E9bfb9D670218b8CFe1Ac7024996"
          nonce="#0"
        />
      </div>
    );
  };

  return (
    <>
      {renderHeader()}
      <img
        src={'./assets/images/backimage.png'}
        style={{ position: 'absolute', right: '-15%', top: '10%' }}
      />
      {renderNetworkBalance()}
      {renderTransactionButtonGroup()}
      {renderHistoryPanel()}
    </>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  selectedToken: state.tokens.selectedToken,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedToken: (token) => setSelectedToken(dispatch, token),
});
export default connect(mapStateToProps, mapDispatchToProps)(TokenShow);
