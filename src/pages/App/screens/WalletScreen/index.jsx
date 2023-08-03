import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import actions
import { setSelectedToken } from '../../../Background/store/actions/TokensActions';
import { getFeeData } from '../../../Background/store/actions/EngineActions';

//import styles
import { colors, fonts } from '../../styles';

//import components
import Header from './Header';
import LoadingScreen from '../../components/LoadingScreen';
import NetworkBalance from '../../components/NetworkBalance';
import { SecondaryButton, PrimaryButton } from '../../components/Buttons';
import TokenTab from './TokenTab';
import TokenShow from './TokenShow';

//import mui
import {
  ArrowUpward,
  ArrowDownward,
  ShoppingCart,
  AccountBalanceWallet,
  SwapHoriz,
  Settings,
} from '@mui/icons-material';
import { Box, IconButton, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
//import mui styles
import { useTabsStyle, useTabStyles } from '../../styles/mui/muiStyles';

const WalletScreen = ({
  currentNetwork,
  networks,
  gettingFeeDataTimerId,
  accounts,
  currentAccountIndex,
  selectedToken,
  setSelectedToken,
  getFeeData,
}) => {
  const tabsStyles = useTabsStyle();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [tabValue, setTabValue] = useState('token');

  useEffect(() => {
    if (networks[currentNetwork]) {
      getFeeData(networks[currentNetwork]);
    }
  }, [currentNetwork]);

  const renderTransactionButtonGroup = () => {
    return (
      <div className="ml-2 mr-2 d-flex flex-row mt-4 align-items-center">
        <div className="mr-1">
          <SecondaryButton
            onClick={() => {
              navigate('/send-token');
            }}
            text="Send"
            icon={
              <ArrowUpward
                style={{
                  fontSize: 16,
                  color: colors.primary5,
                }}
              />
            }
          />
        </div>
        <div className="mr-1">
          <SecondaryButton
            onClick={() => {}}
            text="Receive"
            icon={
              <ArrowDownward
                style={{
                  fontSize: 16,
                  color: colors.primary5,
                }}
              />
            }
          />
        </div>
        <div>
          <SecondaryButton
            onClick={() => {}}
            text="Buy"
            icon={
              <ShoppingCart
                style={{
                  fontSize: 16,
                  color: colors.primary5,
                }}
              />
            }
          />
        </div>
      </div>
    );
  };

  const renderBottomButtons = () => {
    return (
      <div className="d-flex flex-row align-items-center justify-content-around mt-2">
        <IconButton
          onClick={() => {}}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <AccountBalanceWallet
                style={{ color: colors.primary5, fontSize: '30px' }}
              />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.primary5,
              }}
            >
              Wallet
            </div>
          </div>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate('/swap');
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <SwapHoriz style={{ color: colors.grey9, fontSize: '30px' }} />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.grey9,
              }}
            >
              Swap
            </div>
          </div>
        </IconButton>
        <IconButton
          onClick={() => {
            navigate('/setting');
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <Settings style={{ color: colors.grey9, fontSize: '30px' }} />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.grey9,
              }}
            >
              Settings
            </div>
          </div>
        </IconButton>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="w-100 h-100 display-v-h-center">
          <div className="col-lg-4 col-md-5 col-sm-6 col-xs-8 h-100 d-flex flex-column p-2 pb-4 pt-3">
            <div className="flex-fill h-100 d-flex flex-column">
              {selectedToken && (
                <>
                  <TokenShow />
                </>
              )}
              {!selectedToken && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      right: '-15%',
                      top: '10%',
                      zIndex: -1,
                    }}
                  >
                    <img src={'./assets/images/backimage.png'} />
                  </div>
                  <Header />
                  <NetworkBalance />
                  {renderTransactionButtonGroup()}
                  <Box className="mt-3 w-100 flex-fill overflow-auto">
                    <TabContext value={tabValue}>
                      <Box>
                        <TabList
                          onChange={(event, value) => {
                            setTabValue(value);
                          }}
                          classes={tabsStyles}
                        >
                          <Tab
                            label="Token"
                            value="token"
                            style={{
                              color:
                                tabValue === 'token' ? 'white' : colors.grey12,
                              textTransform: 'initial',
                            }}
                          />
                          <Tab
                            label="Collectible"
                            value="collectible"
                            style={{
                              color:
                                tabValue === 'collectible'
                                  ? 'white'
                                  : colors.grey12,
                              textTransform: 'initial',
                            }}
                          />
                        </TabList>
                      </Box>
                      <TabPanel className="p-2" value="token">
                        <TokenTab />
                      </TabPanel>
                      <TabPanel className="p-2" value="collectible">
                        Item Two
                      </TabPanel>
                    </TabContext>
                  </Box>
                </>
              )}
              {renderBottomButtons()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  gettingFeeDataTimerId: state.engine.gettingFeeDataTimerId,
  selectedToken: state.tokens.selectedToken,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedToken: (token) => setSelectedToken(dispatch, token),
  getFeeData: (currentNetworkObject) =>
    getFeeData(dispatch, currentNetworkObject),
});
export default connect(mapStateToProps, mapDispatchToProps)(WalletScreen);
