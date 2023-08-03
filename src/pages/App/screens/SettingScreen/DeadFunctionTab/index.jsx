import React, { useState } from 'react';

// import components
import { PrimaryButton } from '../../../components/Buttons';
import WillTab from './WillTab';
import LegacyTab from './LegacyTab';

// import mui
import { IconButton, Modal, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { KeyboardArrowLeft, Help } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import {
  modalStyle,
  useTabsStyle,
  useTabStyles,
} from '../../../styles/mui/muiStyles';
import { colors, fonts } from '../../../styles';

const DeadFunctionTab = ({ onGoBack }) => {
  const tabStyles = useTabStyles();
  const tabsStyles = useTabsStyle();
  const { enqueueSnackbar } = useSnackbar();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [tabValue, setTabValue] = useState('will');

  const renderAboutModal = () => {
    return (
      <Modal
        open={showAboutModal}
        onClose={() => {
          setShowAboutModal(false);
        }}
        aria-labelledby="dead-about-modal-title"
        aria-describedby="dead-about-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="dead-about-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              About Dead Function
            </h6>
          </div>
          <div
            id="dead-about-modal-description"
            className="text-white d-flex flex-column h-100"
            sx={{ mt: 4 }}
          >
            <p
              className="text-white"
              style={
                {
                  //  ...fonts.para_regular,
                }
              }
            >
              This is new function which allows you to save All of your
              crypto-currencies safe when your account is dead. This is very
              useful when you lost your control over your account.
            </p>
            <div className="flex-fill">
              <PrimaryButton
                text="Close"
                onClick={() => {
                  setShowAboutModal(false);
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderHeader = () => {
    return (
      <div className="mt-4 ml-2 mr-2 mb-1 d-flex flex-row align-items-center">
        <IconButton
          onClick={() => {
            onGoBack();
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
          Dead Function
        </div>
      </div>
    );
  };

  return (
    <>
      <img
        src={'./assets/images/backimage.png'}
        style={{ position: 'absolute', right: '-15%', top: '10%', zIndex: -1 }}
      />
      {renderHeader()}
      {renderAboutModal()}
      <div className="d-flex flex-row align-items-center justify-content-center">
        <div
          className="text-white mr-2 font-weight-bold"
          style={
            {
              // ...fonts.title1
            }
          }
        >
          Set Dead Function
        </div>
        <IconButton
          onClick={() => {
            setShowAboutModal(true);
          }}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <Help
            style={{
              fontSize: '18px',
              color: 'white',
            }}
          />
        </IconButton>
      </div>
      <Box className="mt-2 w-100 flex-fill overflow-hidden">
        <TabContext value={tabValue}>
          <div className="h-100 d-flex flex-column">
            {' '}
            <Box>
              <TabList
                onChange={(event, value) => {
                  setTabValue(value);
                }}
                classes={tabsStyles}
              >
                <Tab
                  label="Will"
                  value="will"
                  style={{
                    color: tabValue === 'will' ? 'white' : colors.grey12,
                    textTransform: 'initial',
                  }}
                />
                <Tab
                  label="Legacy"
                  value="legacy"
                  style={{
                    color: tabValue === 'legacy' ? 'white' : colors.grey12,
                    textTransform: 'initial',
                  }}
                />
              </TabList>
            </Box>
            <TabPanel className="p-2 overflow-auto flex-fill" value="will">
              <WillTab />
            </TabPanel>
            <TabPanel className="p-2 overflow-auto flex-fill" value="legacy">
              <LegacyTab />
            </TabPanel>
          </div>
        </TabContext>
      </Box>
    </>
  );
};

export default DeadFunctionTab;
