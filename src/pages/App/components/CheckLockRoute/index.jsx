import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const CheckLockRoute = ({ children, walletInfo }) => {
  console.log('Check Lock Route: ', walletInfo);
  return (
    <>
      {walletInfo.isInitialized ? (
        walletInfo.isLocked ? (
          <Navigate to="/login" />
        ) : (
          children
        )
      ) : (
        <Navigate to="/initialize" />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  walletInfo: state.wallet,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CheckLockRoute);
