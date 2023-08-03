import React from 'react';
import { connect } from 'react-redux';

import SendTokenEthereum from './SendTokenEthereum';
import SendTokenBinance from './SendTokenBinance';

const SendTokenScreen = ({ networks, currentNetwork }) => {
  return (
    <>
      {networks[currentNetwork].chainType === 'ethereum' && (
        <SendTokenEthereum />
      )}
      {networks[currentNetwork].chainType === 'binance' && <SendTokenBinance />}
    </>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SendTokenScreen);
