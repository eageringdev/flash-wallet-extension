import { ethers } from 'ethers';
import browser from 'webextension-polyfill';

import erc20ABI from '../../../App/abis/erc20ABI.json';

export const sendTransaction = (
  dispatch,
  data,
  beforeWork,
  successCallback,
  failCallback,
  enqueueSnackbar
) => {
  beforeWork();
  const {
    currentNetworkRPC,
    fromPrivateKey,
    toAddress,
    value,
    token,
    feeInfo,
  } = data;
  const provider = new ethers.providers.JsonRpcProvider(currentNetworkRPC);
  const wallet = new ethers.Wallet(fromPrivateKey, provider);
  if (token === 'main') {
    const rawTx = {
      to: toAddress,
      value: ethers.utils.parseEther(value.toString()),
      ...feeInfo,
    };
    console.log(rawTx);
    wallet
      .populateTransaction(rawTx)
      .then((tx) => {
        console.log('Transaction Action send Main: ', tx);
        successCallback(tx);
        wallet
          .sendTransaction(tx)
          .then((resTxn) => {
            console.log('transaction action:::::', resTxn);
            resTxn
              .wait()
              .then((receipt) => {
                console.log(resTxn, receipt);
                browser.notifications.create(
                  receipt.transactionHash.toString(),
                  {
                    type: 'basic',
                    iconUrl: './assets/images/icon-128.png',
                    title: 'Success',
                    message: `Transaction #${resTxn.nonce} is completed.`,
                  }
                );
                enqueueSnackbar(`Transaction #${resTxn.nonce} is completed.`, {
                  variant: 'success',
                  style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                  },
                  anchorOrigin: {
                    horizontal: 'center',
                    vertical: 'bottom',
                  },
                });
              })
              .catch((err) => {
                console.log(err, err.reason);
                if (err.reason != 'cancelled') {
                  // Toast.show({
                  //   type: 'error',
                  //   position: 'bottom',
                  //   bottomOffset: 120,
                  //   text1: 'Error occured',
                  //   props: {
                  //     error: err,
                  //   },
                  // });
                  browser.notifications.create(
                    receipt.transactionHash.toString(),
                    {
                      type: 'basic',
                      iconUrl: './assets/images/icon-128.png',
                      title: 'Error',
                      message: JSON.stringify(err),
                    }
                  );
                  enqueueSnackbar(JSON.stringify(err), {
                    variant: 'error',
                    style: {
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white',
                    },
                    anchorOrigin: {
                      horizontal: 'center',
                      vertical: 'bottom',
                    },
                  });
                }
              });
          })
          .catch((err) => {
            console.log('Transaction Action Error:::::: ', err);
            failCallback();
          });
      })
      .catch((err) => {
        console.log('Transaction Action Error:::::: ', err);
        failCallback();
      });
  } else {
    const tokenContract = new ethers.Contract(
      token.tokenAddress,
      erc20ABI,
      provider
    );
    tokenContract.populateTransaction
      .transfer(toAddress, ethers.utils.parseEther(value.toString()))
      .then((rawTx) => {
        console.log('Transaction actions raw tx: ', rawTx);
        wallet
          .populateTransaction(rawTx)
          .then((refinedTxn) => {
            console.log(refinedTxn);
            successCallback({
              ...refinedTxn,
              //  ...feeInfo
            });
            wallet
              .sendTransaction({
                ...rawTx,
                // ...feeInfo
              })
              .then((resTxn) => {
                console.log(
                  'Token send Transaction actions;;;;;;; Res txn:::: ',
                  resTxn
                );
                resTxn
                  .wait()
                  .then((receipt) => {
                    // Toast.show({
                    //   type: 'txnCompleted',
                    //   position: 'bottom',
                    //   bottomOffset: 120,
                    //   props: {
                    //     transaction: {...resTxn},
                    //   },
                    // });
                    browser.notifications.create(
                      receipt.transactionHash.toString(),
                      {
                        type: 'basic',
                        iconUrl: './assets/images/icon-128.png',
                        title: 'Success',
                        message: `Transaction #${resTxn.nonce} is completed.`,
                      }
                    );
                    enqueueSnackbar(
                      `Transaction #${resTxn.nonce} is completed.`,
                      {
                        variant: 'success',
                        style: {
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: 'white',
                        },
                        anchorOrigin: {
                          horizontal: 'center',
                          vertical: 'bottom',
                        },
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err, err.reason);
                    if (err.reason != 'cancelled') {
                      // Toast.show({
                      //   type: 'error',
                      //   position: 'bottom',
                      //   bottomOffset: 120,
                      //   text1: 'Error occured',
                      //   props: {
                      //     error: err,
                      //   },
                      // });
                      browser.notifications.create(
                        receipt.transactionHash.toString(),
                        {
                          type: 'basic',
                          iconUrl: './assets/images/icon-128.png',
                          title: 'Error',
                          message: JSON.stringify(err),
                        }
                      );
                      enqueueSnackbar(JSON.stringify(err), {
                        variant: 'error',
                        style: {
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: 'white',
                        },
                        anchorOrigin: {
                          horizontal: 'center',
                          vertical: 'bottom',
                        },
                      });
                    }
                  });
              })
              .catch((err) => {
                console.log('Transaction Action Error:::::: ', err);
                failCallback();
              });
          })
          .catch((err) => {
            console.log('Transaction Action Error:::::: ', err);
            failCallback();
          });
      })
      .catch((err) => {
        console.log('Transaction Action Error:::::: ', err);
        failCallback();
      });
  }
};
