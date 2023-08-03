import React from 'react';
import { connect } from 'react-redux';

import SwapEthereum from './SwapEthereum';
import SwapBinance from './SwapBinance';

const SwapScreen = ({ networks, currentNetwork }) => {
  return (
    <>
      {networks[currentNetwork].chainType === 'ethereum' && <SwapEthereum />}
      {networks[currentNetwork].chainType === 'binance' && <SwapBinance />}
    </>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(SwapScreen);
