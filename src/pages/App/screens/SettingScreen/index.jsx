import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

//import actions
import { setWalletData } from '../../../Background/store/actions/WalletActions';

//import components
import LoadingScreen from '../../components/LoadingScreen';
import Preferences from './Preferences';
import DeadFunctionTab from './DeadFunctionTab';

//import mui
import { Button, IconButton } from '@mui/material';
import {
  KeyboardArrowRight,
  VerifiedUserRounded,
  Bookmark,
  Visibility,
  SettingsApplications,
  HelpCenter,
  Feedback,
  Logout,
  Share,
  AccountBalanceWallet,
  SwapHoriz,
  Settings,
} from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../styles';

const SettingScreen = ({ setWalletData }) => {
  const navigate = useNavigate();
  const [showStatus, setShowStatus] = useState('default');
  const [loading, setLoading] = useState(false);

  const onLogOut = () => {
    setLoading(true);
    browser.storage.sync
      .set({
        wallets_info: {
          isLocked: true,
          isInitialized: true,
        },
      })
      .then(() => {
        setWalletData({
          isLocked: true,
          isInitialized: true,
        });
        navigate('/login');
      })
      .catch((err) => {
        console.log('Error in mainscreen: ', err);
        setLoading(false);
      });
  };

  const renderSettingsRow = (icon, name, onClick, color) => {
    return (
      <Button
        className="d-flex flex-row align-items-center p-2 mt-1 mb-1 ml-1 mr-1"
        onClick={onClick}
      >
        <div>{icon}</div>
        <div
          className="ml-2 font-weight-bold flex-fill text-left"
          style={{
            // ...fonts.title2,
            color: color || 'white',
          }}
        >
          {name}
        </div>
        <div>
          <KeyboardArrowRight
            style={{
              fontSize: '18px',
              color: color || 'white',
            }}
          />
        </div>
      </Button>
    );
  };

  const MainSettingsTab = () => {
    return (
      <>
        <img
          src={'./assets/images/backimage.png'}
          style={{
            position: 'absolute',
            right: '-15%',
            top: '10%',
            zIndex: -1,
          }}
        />
        <div
          className="mt-4 pl-2 pr-2 pb-1 text-center text-white font-weight-bold"
          style={
            {
              // ...fonts.title2
            }
          }
        >
          Settings
        </div>
        <div className="mt-4 ml-1 mr-1 d-flex flex-column overflow-auto">
          {renderSettingsRow(
            <VerifiedUserRounded
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'Account',
            () => {}
          )}
          {renderSettingsRow(
            <Bookmark
              style={{
                fontSize: '32px',
                color: colors.primary5,
              }}
            />,
            'Set Dead Function',
            () => {
              setShowStatus('deadfunction');
            },

            colors.primary5
          )}
          {renderSettingsRow(
            <Share
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'Share My Public Address',
            () => {}
          )}
          {renderSettingsRow(
            <Visibility
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'View on Etherscan',
            () => {}
          )}
          {renderSettingsRow(
            <SettingsApplications
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'Preferences',
            () => {
              setShowStatus('prefereneces');
            }
          )}
          {renderSettingsRow(
            <HelpCenter
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'Get Help',
            () => {}
          )}
          {renderSettingsRow(
            <Feedback
              style={{
                fontSize: '32px',
                color: 'white',
              }}
            />,
            'Send Feed back',
            () => {}
          )}

          <div className="flex-fill d-flex flex-column-reverse mb-2 pt-5">
            {renderSettingsRow(
              <Logout
                style={{
                  fontSize: '32px',
                  color: 'white',
                }}
              />,
              'Log out',
              () => {
                onLogOut();
              }
            )}
          </div>
        </div>
      </>
    );
  };

  const onGoBack = () => {
    setShowStatus('default');
  };

  const renderBottomButtons = () => {
    return (
      <div className="d-flex flex-row align-items-center justify-content-around mt-2">
        <IconButton
          onClick={() => {
            navigate('/wallet');
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <AccountBalanceWallet
                style={{ color: colors.grey9, fontSize: '30px' }}
              />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.grey9,
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
          onClick={() => {}}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <div>
              <Settings style={{ color: colors.primary5, fontSize: '30px' }} />
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: colors.primary5,
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
            {showStatus === 'default' && <MainSettingsTab />}
            {showStatus === 'prefereneces' && (
              <Preferences onGoBack={onGoBack} />
            )}
            {showStatus === 'deadfunction' && (
              <DeadFunctionTab onGoBack={onGoBack} />
            )}
            {renderBottomButtons()}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setWalletData: (data) => setWalletData(dispatch, data),
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
