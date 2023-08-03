import React from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const OnlyInitializationRoutes = ({ walletInfo }) => {
  console.log('OnlyInitialRoute: ', walletInfo);
  return (
    <>
      {walletInfo.isInitialized ? (
        walletInfo.isLocked ? (
          <Navigate to="/login" />
        ) : (
          <Navigate to="/wallet" />
        )
      ) : (
        <Outlet />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  walletInfo: state.wallet,
});
const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnlyInitializationRoutes);
