import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { ethers } from 'ethers';
import { updateTokenBalanceInfo } from '../../../Background/store/actions/BalancesActions';
import GradientText from '../GradientText';

const minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

const TokenBalanceText = ({
  token,
  style,
  className,
  address,
  balancesInfo,
  networks,
  currentNetwork,
  updateTokenBalanceInfo,
  gradient = false,
  currentAccountIndex,
}) => {
  const { tokenAddress, tokenDecimal, tokenSymbol } = token;
  useEffect(() => {
    let beforeBalance = balancesInfo[address]
      ? balancesInfo[address][tokenAddress]
        ? parseFloat(balancesInfo[address][tokenAddress])
        : 0
      : 0;
    const network = networks[currentNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);

    const contract = new ethers.Contract(tokenAddress, minABI, provider);
    provider.on('block', (blockNum) => {
      contract.balanceOf(address).then((res) => {
        const value = ethers.utils.formatUnits(res, tokenDecimal);
        if (parseFloat(beforeBalance) !== parseFloat(value)) {
          beforeBalance = parseFloat(value);
          updateTokenBalanceInfo({
            address,
            balance: value,
            tokenAddress,
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
      ? balancesInfo[address][tokenAddress]
        ? parseFloat(balancesInfo[address][tokenAddress])
        : 0
      : 0;
    const network = networks[currentNetwork];
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    const contract = new ethers.Contract(tokenAddress, minABI, provider);
    contract.balanceOf(address).then((res) => {
      const value = ethers.utils.formatUnits(res, tokenDecimal);
      if (parseFloat(beforeBalance) !== parseFloat(value)) {
        updateTokenBalanceInfo({
          address,
          balance: value,
          tokenAddress,
        });
      }
    });
  }, [currentNetwork, currentAccountIndex]);

  return (
    <>
      {gradient ? (
        <GradientText fontSize={'30px'}>
          {balancesInfo[address] != undefined &&
          balancesInfo[address][tokenAddress] != undefined
            ? parseFloat(balancesInfo[address][tokenAddress]) > 0
              ? parseFloat(balancesInfo[address][tokenAddress]).toFixed(4) +
                ' ' +
                tokenSymbol
              : '0 ' + tokenSymbol
            : '0 ' + tokenSymbol}
        </GradientText>
      ) : (
        <div style={style} className={className}>
          {balancesInfo[address] != undefined &&
          balancesInfo[address][tokenAddress] != undefined
            ? parseFloat(balancesInfo[address][tokenAddress]) > 0
              ? parseFloat(balancesInfo[address][tokenAddress]).toFixed(4) +
                ' ' +
                tokenSymbol
              : '0 ' + tokenSymbol
            : '0 ' + tokenSymbol}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  balancesInfo: state.balances.balancesInfo,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  currentAccountIndex: state.accounts.currentAccountIndex,
});
const mapDispatchToProps = (dispatch) => ({
  updateTokenBalanceInfo: (data) => updateTokenBalanceInfo(dispatch, data),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenBalanceText);
