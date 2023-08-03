import React, { useState } from 'react';

//import components
import General from './General';
import SecurityAndPrivacy from './SecurityAndPrivacy';

//import mui
import { Button, IconButton, Box, Modal } from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';

//import styles
import { colors } from '../../../styles';

const Preferences = ({ onGoBack }) => {
  const [status, setStatus] = useState('default');

  const renderSettingsRow = (icon, name, onClick, info) => {
    return (
      <Button
        className="d-flex flex-row align-items-center p-1 mt-1 mb-2 ml-1 mr-1"
        onClick={onClick}
        style={{
          width: '-webkit-fill-available',
        }}
      >
        <div>{icon ? icon : <></>}</div>
        <div
          className="flex-fill text-left"
          style={{ marginLeft: icon ? '16px' : '0px', marginRight: '16px' }}
        >
          <div
            className="text-white font-weight-bold"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            {name}
          </div>
          <div
            style={{
              // ...fonts.caption_small12_18_regular,
              color: colors.grey9,
              marginTop: '8px',
            }}
          >
            {info}
          </div>
        </div>
        <div>
          <KeyboardArrowRight
            style={{
              fontSize: '16px',
              color: 'white',
            }}
          />
        </div>
      </Button>
    );
  };

  const renderHeader = () => {
    return (
      <div className="mt-4 ml-2 mr-2 mb-1 d-flex flex-row align-items-center">
        <IconButton
          onClick={() => {
            if (status === 'default') {
              onGoBack();
            } else {
              setStatus('default');
            }
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <KeyboardArrowLeft
            style={{
              fontSize: '18px',
              color: 'white',
            }}
          />
        </IconButton>
        <div
          className="flex-fill text-center text-white font-weight-bold"
          style={
            {
              // ...fonts.title2
            }
          }
        >
          {status === 'default' && 'Preferences'}
          {status === 'general' && 'General'}
          {status === 'security_privacy' && 'Security & Privacy'}
        </div>
      </div>
    );
  };

  const renderDefaultStatus = () => {
    return (
      <div className="mt-4 ml-1 mr-1 mb-3 overflow-auto">
        {renderSettingsRow(
          undefined,
          'General',
          () => {
            setStatus('general');
          },
          'Currency conversion, primary currency, language and search engine'
        )}
        {renderSettingsRow(
          undefined,
          'Security & Privacy',
          () => {
            setStatus('security_privacy');
          },
          'Privacy settings, private key and wallet seed phrase'
        )}
        {renderSettingsRow(
          undefined,
          'Advanced',
          () => {},
          'Access developer features, reset account, setup testnets, sync extension, state logs,...'
        )}
        {renderSettingsRow(
          undefined,
          'Contracts',
          () => {},
          'Add, edit, remove, and manage your accounts'
        )}
        {renderSettingsRow(
          undefined,
          'Networks',
          () => {},
          'Add and edit custom RPC networks'
        )}
        {renderSettingsRow(undefined, 'Experimental', () => {}, 'About DeGe')}
      </div>
    );
  };

  const renderGeneralStatus = () => {
    return <General />;
  };

  const renderSecurityAndPrivacy = () => {
    return <SecurityAndPrivacy />;
  };

  return (
    <>
      <img
        src={'./assets/images/backimage.png'}
        style={{ position: 'absolute', right: '-15%', top: '10%', zIndex: -1 }}
      />
      {renderHeader()}
      {status === 'default' && renderDefaultStatus()}
      {status === 'general' && renderGeneralStatus()}
      {status === 'security_privacy' && renderSecurityAndPrivacy()}
    </>
  );
};

export default Preferences;
