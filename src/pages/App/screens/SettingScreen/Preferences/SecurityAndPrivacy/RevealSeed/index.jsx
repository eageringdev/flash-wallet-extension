import React, { useState } from 'react';

//import components
import PasswordInput from '../../../../../components/CustomInputs/PasswordInput';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import MultilineInput from '../../../../../components/CustomInputs/MultilineInput';
import { PrimaryButton, TextButton } from '../../../../../components/Buttons';
import { ContentCopy } from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { useSnackbar } from 'notistack';

// import utils
import { checkAuthentication } from '../../../../../utils/auth';
import { loadMnemonic } from '../../../../../utils/mnemonic';
import copy from 'copy-to-clipboard';

//import styles
import { colors, fonts } from '../../../../../styles';
import {
  useTabsStyle,
  useTabStyles,
} from '../../../../../styles/mui/muiStyles';

const RevealSeed = ({ onDone }) => {
  const { enqueueSnackbar } = useSnackbar();

  const tabStyles = useTabStyles();
  const tabsStyles = useTabsStyle();

  const [status, setStatus] = useState('check');
  const [tabValue, setTabValue] = useState('text');

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nextLoading, setNextLoading] = useState(false);

  const [seedPhrase, setSeedPhrase] = useState('seed phrase goes here');

  const onClickNext = () => {
    checkAuthentication(
      password,
      () => {
        setNextLoading(true);
      },
      () => {
        setNextLoading(false);
        setStatus('done');
        loadMnemonic(
          (mnemonic) => {
            console.log(mnemonic);
            setSeedPhrase(mnemonic);
          },
          () => {
            console.log('Fail on load mnemonic');
          }
        );
      },
      () => {
        setNextLoading(false);
        setError("Passsword isn't correct.");
      },
      () => {
        console.log('ERROR in reveal seed phrase');
        setNextLoading(false);
        setError('Something went wrong.');
      }
    );
  };

  const onClickCopy = () => {
    copy(seedPhrase);
    enqueueSnackbar('Copied to Clipboard', {
      variant: 'success',
      anchorOrigin: {
        horizontal: 'center',
        vertical: 'bottom',
      },
    });
  };

  const renderCheckPanel = () => {
    return (
      <>
        <div className="mt-4">
          <div
            style={{
              // ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            If you ever change browser or move computers, you will need this
            seed phrase to access your accounts. Save them somewhere safe and
            secret
          </div>
          <div
            className="mt-2"
            style={{
              //   ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            <span
              className="font-weight-bold"
              style={{
                // ...fonts.para_semibold,
                color: colors.red5,
              }}
            >
              DO NOT
            </span>{' '}
            share this phrase with anymore! These words can be used to steal all
            your accounts
          </div>
        </div>
        <div className="mt-4">
          <PasswordInput
            value={password}
            onChangeValue={(value) => setPassword(value)}
            label="Enter password to continue"
          />
          {error.length > 0 && (
            <div
              className="mt-1 ml-2 "
              style={{
                color: colors.red5,
                // ...fonts.caption_small12_16_regular,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderDonePanel = () => {
    const renderTextTab = () => {
      return (
        <div>
          <div className="mt-2 p-2">
            <MultilineInput
              label={'Seed Phrase'}
              value={seedPhrase}
              row={4}
              editable={false}
              onChangeValue={() => {}}
            />
          </div>
          <div className="mt-4">
            <TextButton
              text={'Copy to Clipboard'}
              icon={<ContentCopy style={{ color: colors.primary5 }} />}
              onClick={() => {
                onClickCopy();
              }}
            />
          </div>
        </div>
      );
    };

    const renderQRTab = () => {
      return (
        <div className="display-v-h-center h-100">
          <QRCode value={seedPhrase} size={200} />
        </div>
      );
    };

    return (
      <Box className="mt-2 w-100 flex-fill overflow-auto">
        <TabContext value={tabValue}>
          <Box>
            <TabList
              onChange={(event, value) => {
                setTabValue(value);
              }}
              classes={tabsStyles}
            >
              <Tab
                label="Text"
                value="text"
                style={{
                  color: tabValue === 'text' ? 'white' : colors.grey12,
                  textTransform: 'initial',
                }}
              />
              <Tab
                label="QR Code"
                value="qr"
                style={{
                  color: tabValue === 'qr' ? 'white' : colors.grey12,
                  textTransform: 'initial',
                }}
              />
            </TabList>
          </Box>
          <TabPanel style={{ height: '300px' }} className="p-2" value="text">
            {renderTextTab()}
          </TabPanel>
          <TabPanel style={{ height: '300px' }} className="p-2" value="qr">
            {renderQRTab()}
          </TabPanel>
        </TabContext>
      </Box>
    );
  };

  return (
    <>
      <div className="d-flex flex-column ml-2 mr-2">
        <div>
          <div
            className="mt-1 font-weight-bold text-white text-center"
            style={
              {
                //   ...fonts.title2,
              }
            }
          >
            Reveal Seed Phrase
          </div>
          {status === 'check' && renderCheckPanel()}
          {status === 'done' && renderDonePanel()}
        </div>
        <div className="flex-fill mb-3 mt-3">
          {status === 'check' && (
            <PrimaryButton
              loading={nextLoading}
              text="Next"
              onClick={() => {
                onClickNext();
              }}
              enableFlag={password.length > 0}
            />
          )}
          {status === 'done' && (
            <PrimaryButton
              text="Done"
              onClick={() => {
                onDone();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RevealSeed;
