import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ethers, utils } from 'ethers';

//import components
import { PrimaryButton, TextButton } from '../../../components/Buttons';

//import mui
import { Modal, Box, Divider, IconButton } from '@mui/material';
import { modalStyle } from '../../../styles/mui/muiStyles';
import { Clear } from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../../styles';

import {
  numeratorForNewTxn,
  denominatorForNewTxn,
} from '../../../../App/engine/constants';

const TransactionModal = ({
  submittedTxn,
  submittedTxnTime,
  submittedAccount,
  submittedNetworkRPC,
  onClose,
  onSubmittedNewTxn,
  onSuccessNewTxn,
  onFailNewTxn,
  networks,
  currentNetwork,
}) => {
  const [showSpeedUpModal, setShowSpeedUpModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [speedLoading, setSpeedLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const provider = new ethers.providers.JsonRpcProvider(submittedNetworkRPC);
  const wallet = new ethers.Wallet(submittedAccount.privateKey, provider);
  const currentNetworkSymbol = networks[currentNetwork].symbol;

  const speedUpTxn = () => {
    console.log('Starting new');
    const newTxn = {
      ...submittedTxn,
      maxFeePerGas: submittedTxn.maxFeePerGas
        .div(denominatorForNewTxn)
        .mul(numeratorForNewTxn),
      maxPriorityFeePerGas: submittedTxn.maxPriorityFeePerGas
        .div(denominatorForNewTxn)
        .mul(numeratorForNewTxn),
    };
    console.log('new Txn: ', newTxn);
    setSpeedLoading(true);
    wallet
      .sendTransaction(newTxn)
      .then((newTxnRes) => {
        // setSpeedLoading(false);
        setShowSpeedUpModal(false);
        onClose();
        console.log('newTxn Res: ', newTxnRes);
        onSubmittedNewTxn('Speeding Up Transaction...', 'Tap to hide');
        newTxnRes
          .wait()
          .then((newReciept) => {
            console.log('newReciept: ', newReciept);
            onSuccessNewTxn(
              'Speeded Up Txn #' + newTxnRes.nonce,
              'Tap to hide'
            );
          })
          .catch((err) => {
            console.log('Speed UP Txn ERR::::::: ', err);
            onFailNewTxn('Fail speeding up.', 'Tap to hide');
          });
      })
      .catch((err) => {
        // setSpeedLoading(false);
        onClose();
        console.log('Speed UP Txn ERR::::::: ', err);
        onFailNewTxn('Fail speeding up.', 'Tap to hide');
      });
  };

  const cancelTxn = () => {
    console.log('Canceling Txn');
    console.log('Starting new');
    const newTxn = {
      ...submittedTxn,
      maxFeePerGas: submittedTxn.maxFeePerGas
        .div(denominatorForNewTxn)
        .mul(numeratorForNewTxn),
      maxPriorityFeePerGas: submittedTxn.maxPriorityFeePerGas
        .div(denominatorForNewTxn)
        .mul(numeratorForNewTxn),
      to: submittedAccount.address,
      value: ethers.BigNumber.from(0),
    };
    console.log('new Txn: ', newTxn);
    setCancelLoading(true);
    wallet
      .sendTransaction(newTxn)
      .then((newTxnRes) => {
        // setCancelLoading(false);
        setShowCancelModal(false);
        onClose();
        console.log('newTxn Res: ', newTxnRes);
        onSubmittedNewTxn('Cancelling Transaction...', 'Tap to hide');
        newTxnRes
          .wait()
          .then((newReciept) => {
            console.log('newReciept: ', newReciept);
            onSuccessNewTxn('Cancelled Txn #' + newTxnRes.nonce, 'Tap to hide');
          })
          .catch((err) => {
            console.log('Cancel Txn ERR1::::::: ', err);
            onFailNewTxn('Fail cancelling.', 'Tap to hide');
          });
      })
      .catch((err) => {
        // setCancelLoading(false);
        onClose();
        console.log('Cancel Txn ERR2::::::: ', err);
        onFailNewTxn('Fail cancelling.', 'Tap to hide');
      });
  };

  const renderCancelModal = () => {
    return (
      <Modal
        open={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
        }}
        aria-labelledby="cancel-modal-title"
        aria-describedby="cancel-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="cancel-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Attempt to Cancel?
            </h6>
          </div>
          <div
            id="cancel-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            <div
              className="mt-2 text-center"
              style={{
                //   ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Gas Cancellation Fee
            </div>
            <div
              className="text-center text-white font-weight-bold mt-2"
              style={
                {
                  //   ...fonts.title1,
                }
              }
            >
              {'<' + '0.0001 ' + currentNetworkSymbol}
            </div>
            <div
              className="mt-4 text-center"
              style={{
                color: colors.grey9,
                //   ...fonts.para_regular,
              }}
            >
              If the cancellation attempt is successful, you will be charged the
              transaction fee above.
            </div>
            <div className="mt-4 d-flex flex-row align-items-center justify-content-around">
              <TextButton
                className="m-0"
                text="Cancel"
                style={{ width: '160px' }}
                onClick={() => {
                  setShowCancelModal(false);
                }}
              />
              <PrimaryButton
                className="m-0"
                loading={cancelLoading}
                style={{ width: '160px' }}
                text="Yes, Try"
                onClick={() => {
                  cancelTxn();
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderSpeedUpModal = () => {
    return (
      <Modal
        open={showSpeedUpModal}
        onClose={() => {
          setShowSpeedUpModal(false);
        }}
        aria-labelledby="speed-modal-title"
        aria-describedby="speed-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="speed-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Attempt to Speed Up?
            </h6>
          </div>
          <div
            id="speed-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            <div
              className="mt-2 text-center"
              style={{
                //   ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Gas Speed Up Fee
            </div>
            <div
              className="text-center text-white font-weight-bold mt-2"
              style={
                {
                  //   ...fonts.title1,
                }
              }
            >
              {'<' + '0.0001 ' + currentNetworkSymbol}
            </div>
            <div
              className="mt-4 text-center"
              style={{
                color: colors.grey9,
                //   ...fonts.para_regular,
              }}
            >
              If the speed up attempt is successful, you will be charged the
              transaction fee above.
            </div>
            <div className="mt-4 d-flex flex-row align-items-center justify-content-around">
              <TextButton
                className="m-0"
                text="Cancel"
                style={{ width: '160px' }}
                onClick={() => {
                  setShowSpeedUpModal(false);
                }}
              />
              <PrimaryButton
                className="m-0"
                loading={cancelLoading}
                style={{ width: '160px' }}
                text="Yes, Try"
                onClick={() => {
                  speedUpTxn();
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderCancelModal()}
      {renderSpeedUpModal()}
      {submittedTxn && (
        <div>
          <div className="mt-1 d-flex flex-row">
            <div
              className="flex-fill text-white text-center font-weight-bold"
              style={
                {
                  // ...fonts.title2
                }
              }
            >
              {'Sent ' + currentNetworkSymbol}
            </div>
            <IconButton
              onClick={() => {
                onClose();
              }}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              <Clear className="text-white" style={{ fontSize: '18px' }} />
            </IconButton>
          </div>
          <div className="mt-2 d-flex flex-row align-items-center  justify-content-between ml-2 mr-2">
            <div>
              <div
                style={{
                  //   ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                Status
              </div>
              <div
                className="font-weight-bold"
                style={{
                  //   ...fonts.para_semibold,
                  color: colors.primary5,
                }}
              >
                Submited
              </div>
            </div>
            <div>
              <div
                className="text-right"
                style={{
                  //   ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                Date
              </div>
              <div
                className="text-white"
                style={
                  {
                    //   ...fonts.caption_small12_18_regular,
                  }
                }
              >
                {submittedTxnTime}
              </div>
            </div>
          </div>
          <div className="mt-2 ml-2 mr-2 d-flex flex-row align-items-center justify-content-between">
            <div>
              <div
                style={{
                  //   ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                From
              </div>
              <div
                className="text-white"
                style={
                  {
                    //   ...fonts.para_regular,
                  }
                }
              >
                {submittedAccount.address.slice(0, 6) +
                  '...' +
                  submittedAccount.address.slice(-4)}
              </div>
            </div>
            <div>
              <div
                className="text-right"
                style={{
                  //   ...fonts.caption_small12_18_regular,
                  color: colors.grey9,
                }}
              >
                To
              </div>
              <div
                className="text-white"
                style={
                  {
                    //   ...fonts.para_regular,
                  }
                }
              >
                {submittedTxn.to.slice(0, 6) +
                  '...' +
                  submittedTxn.to.slice(-4)}
              </div>
            </div>
          </div>
          <div className="mt-2 ml-2 mr-2">
            <div
              style={{
                // ...fonts.caption_small12_18_regular,
                color: colors.grey9,
              }}
            >
              Nonce
            </div>
            <div
              style={{
                // ...fonts.para_regular,
                color: 'white',
              }}
            >
              {'#' + submittedTxn.nonce}
            </div>
          </div>
          <div className="mt-2 ml-2 mr-2">
            <div className="d-flex flex-row align-items-center">
              <div
                className="flex-fill text-left text-white"
                style={
                  {
                    // ...fonts.para_regular,
                  }
                }
              >
                Amount
              </div>
              <div
                className="text-white"
                style={
                  {
                    // ...fonts.para_regular
                  }
                }
              >
                {submittedTxn.value
                  ? utils.formatEther(submittedTxn.value) +
                    ' ' +
                    currentNetworkSymbol
                  : '0 ' + currentNetworkSymbol}
              </div>
            </div>
            <div className="d-flex flex-row align-items-center mt-1">
              <div
                className="text-white flex-fill text-left"
                style={
                  {
                    //  ...fonts.para_regular,
                  }
                }
              >
                Network Fee
              </div>
              <div
                className="text-white ml-2"
                style={
                  {
                    //   ...fonts.para_regular,
                  }
                }
              >
                {utils.formatEther(
                  submittedTxn.gasLimit.mul(submittedTxn.maxFeePerGas)
                ) +
                  ' ' +
                  currentNetworkSymbol}
              </div>
            </div>
            <Divider
              className="mt-1 mb-1"
              style={{
                backgroundColor: colors.grey12,
              }}
            />
            <div className="mt-1 d-flex flex-row">
              <div
                className="text-white font-weight-bold flex-fill text-left"
                style={
                  {
                    // ...fonts.title2,
                  }
                }
              >
                Total Amount
              </div>
              <div className="text-right ml-2">
                <div
                  className="text-white font-weight-bold"
                  style={
                    {
                      // ...fonts.title2
                    }
                  }
                >
                  {utils.formatEther(
                    submittedTxn.value
                      ? submittedTxn.gasLimit
                          .mul(submittedTxn.maxFeePerGas)
                          .add(submittedTxn.value)
                      : submittedTxn.gasLimit.mul(submittedTxn.maxFeePerGas)
                  ) +
                    ' ' +
                    currentNetworkSymbol}
                </div>
                <div
                  className="mt-1"
                  style={{
                    //   ...fonts.caption_small12_18_regular,
                    color: colors.grey9,
                  }}
                >
                  {'$231.234'}
                </div>
              </div>
            </div>
            <div className="mt-4 mb-2 d-flex flex-row align-items-center justify-content-around">
              <TextButton
                className="m-0"
                text="Cancel"
                onClick={() => {
                  setShowCancelModal(true);
                }}
              />
              <PrimaryButton
                className="m-0"
                text="Speed Up"
                onClick={() => {
                  setShowSpeedUpModal(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
});
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(TransactionModal);
