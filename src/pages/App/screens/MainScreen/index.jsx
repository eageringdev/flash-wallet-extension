import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';

//import browser
import browser from 'webextension-polyfill';

// import utils
import { setWalletData } from '../../../Background/store/actions/WalletActions';

import { colors } from '../../styles';

import { useSnackbar } from 'notistack';
import { modalStyle } from '../../styles/mui/muiStyles';
import TransactionModal from '../SendTokenScreen/TransactionModal';
import { ethers, utils } from 'ethers';
import { Box, Modal } from '@mui/material';
import moment from 'moment';

const tempTxn = {
  type: 2,
  chainId: 4,
  nonce: 56,
  maxPriorityFeePerGas: utils.parseEther('0.0000000015'),
  maxFeePerGas: utils.parseEther('0.000000001500000016'),
  gasPrice: null,
  gasLimit: ethers.BigNumber.from(21000),
  to: '0xB1e50315BbDa7D9Fd7e4F030e26eEC585A1Efc0c',
  value: utils.parseEther('0.001'),
  data: '0x',
  accessList: [],
  hash: '0xde8f5411d2d531817747a1ddab3ef4f25ffc721edb9f7ad3eed5dba864b27f84',
  v: 0,
  r: '0x60d1134a116991601e9f02d08c45f9e7c72bc738d58f5e46f3a4e232f40cf92d',
  s: '0x353d211b728e8a67ffdebe3fa5aedabb62c444c8a93816870fb17976b78d9da3',
  from: '0x632Bd9a598cd5c52F1625c850A6c46ECd4Cb7829',
  confirmations: 0,
};

const MainScreen = ({
  setWalletData,
  accounts,
  currentAccountIndex,
  networks,
  currentNetwork,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // saveLastOpenTime();
  }, []);

  const onLogOut = () => {};

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="text-white display-v-h-center">
          <div>
            <Modal
              open={true}
              onClose={() => {}}
              aria-describedby="seed-modal-description"
            >
              <Box sx={modalStyle}>
                <div
                  id="seed-modal-description"
                  className="text-white"
                  sx={{ mt: 4 }}
                >
                  <TransactionModal
                    submittedTxn={tempTxn}
                    submittedTxnTime={moment(new Date().valueOf())
                      .format('MMM DD [at] hh:mm a')
                      .toString()}
                    submittedAccount={accounts[currentAccountIndex]}
                    submittedNetworkRPC={networks[currentNetwork].rpc}
                    onClose={() => {}}
                    onSubmittedNewTxn={(text1, text2) => {}}
                    onSuccessNewTxn={(text1, text2) => {}}
                    onFailNewTxn={(text1, text2) => {}}
                  />
                </div>
              </Box>
            </Modal>
            <div>MainScreen</div>
            <button
              className="btn btn-danger"
              onClick={() => {
                onLogOut();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
});
const mapDispatchToProps = (dispatch) => ({
  setWalletData: (data) => setWalletData(dispatch, data),
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
