import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { ethers } from 'ethers';
import { updateBalanceInfo } from '../../../Background/store/actions/BalancesActions';
import GradientText from '../GradientText';

const BalanceText = ({
  style,
  className,
  address,
  balancesInfo,
  networks,
  currentNetwork,
  updateBalanceInfo,
  gradient = false,
  currentAccountIndex,
}) => {
  useEffect(() => {
    let beforeBalance = balancesInfo[address]
      ? balancesInfo[address].main
        ? parseFloat(balancesInfo[address].main)
        : 0
      : 0;
    // console.log('init beforeBalance:::: ', beforeBalance);
    const network = networks[currentNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    provider.on('block', (blockNum) => {
      provider.getBalance(address).then((res) => {
        const value = ethers.utils.formatEther(res);
        if (parseFloat(beforeBalance) !== parseFloat(value)) {
          beforeBalance = parseFloat(value);
          updateBalanceInfo({
            address,
            balance: value,
          });
        }
      });
    });
    return () => {
      provider.off('block');
    };
  }, []);

  useEffect(() => {
    let beforeBalance = balancesInfo[address]
      ? balancesInfo[address].main
        ? parseFloat(balancesInfo[address].main)
        : 0
      : 0;
    const network = networks[currentNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    provider.getBalance(address).then((res) => {
      const value = ethers.utils.formatEther(res);
      if (parseFloat(beforeBalance) !== parseFloat(value)) {
        updateBalanceInfo({
          address,
          balance: value,
        });
      }
    });
  }, [currentNetwork, currentAccountIndex]);

  const currentNetworkSymbol = networks[currentNetwork].symbol;
  return (
    <>
      {gradient ? (
        <GradientText fontSize={'30px'}>
          {balancesInfo[address]
            ? parseFloat(balancesInfo[address].main) > 0
              ? parseFloat(balancesInfo[address].main).toFixed(4) +
                ' ' +
                currentNetworkSymbol
              : '0 ' + currentNetworkSymbol
            : '0 ' + currentNetworkSymbol}
        </GradientText>
      ) : (
        <div style={style} className={className || ''}>
          {balancesInfo[address]
            ? parseFloat(balancesInfo[address].main) > 0
              ? parseFloat(balancesInfo[address].main).toFixed(4) +
                ' ' +
                currentNetworkSymbol
              : '0 ' + currentNetworkSymbol
            : '0 ' + currentNetworkSymbol}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    balancesInfo: state.balances.balancesInfo,
    networks: state.networks.networks,
    currentNetwork: state.networks.currentNetwork,
    currentAccountIndex: state.accounts.currentAccountIndex,
  };
};
const mapDispatchToProps = (dispatch) => ({
  updateBalanceInfo: (data) => updateBalanceInfo(dispatch, data),
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceText);
