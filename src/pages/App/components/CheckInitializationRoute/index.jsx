import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const CheckInitializationRoute = ({ children, walletInfo }) => {
  console.log('Check Initialization Route: ', walletInfo);
  return (
    <>{walletInfo.isInitialized ? children : <Navigate to="/initialize" />}</>
  );
};

const mapStateToProps = (state) => ({
  walletInfo: state.wallet,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckInitializationRoute);
