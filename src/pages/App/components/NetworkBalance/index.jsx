import React from 'react';
import { connect } from 'react-redux';
import { colors, fonts } from '../../styles';

import BalanceText from '../BalanceText';
import GradientText from '../GradientText';

const NetworkBalance = ({
  accounts,
  currentAccountIndex,
  networks,
  currentNetwork,
}) => {
  const currentNetworkSymbol = networks[currentNetwork].symbol;
  return (
    <div style={{ marginLeft: 24, marginTop: 24 }}>
      <div>
        {accounts && accounts[currentAccountIndex] ? (
          <BalanceText
            gradient={true}
            style={
              {
                // ...fonts.big_type1
              }
            }
            address={accounts[currentAccountIndex].address}
          />
        ) : (
          <GradientText fontSize={'30px'}>
            {0 + ' ' + currentNetworkSymbol}
          </GradientText>
        )}
      </div>
      <div className="mt-1 text-white">$16,858.15</div>
      <div
        className="ml-1"
        style={{
          // ...fonts.para_regular,
          color: colors.primary5,
        }}
      >
        +0.7%
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkBalance);
