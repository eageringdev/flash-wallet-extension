import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import components
import LoadingScreen from '../../components/LoadingScreen';

//import mui
import { Clear } from '@mui/icons-material';
import { Box, IconButton, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTabsStyle, useTabStyles } from '../../styles/mui/muiStyles';
import CustomTab from './CustomTab';
import SearchTab from './SearchTab';

import { colors, fonts } from '../../styles';

const AddTokenScreen = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('custom');

  const tabStyles = useTabStyles();
  const tabsStyles = useTabsStyle();

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="w-100 h-100 display-v-h-center">
          <div className="col-lg-4 col-md-5 col-sm-6 col-xs-8 h-100 d-flex flex-column p-2 pb-5 pt-3">
            <div className="mt-2 d-flex flex-row align-items-center">
              <div className="text-white font-weight-bold flex-fill text-center">
                Add Asset
              </div>
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                <Clear className="text-white" style={{ fontSize: '18px' }} />
              </IconButton>
            </div>

            <Box className="mt-3 w-100 h-100">
              <TabContext value={tabValue}>
                <Box>
                  <TabList
                    onChange={(event, value) => {
                      setTabValue(value);
                    }}
                    classes={tabsStyles}
                  >
                    <Tab
                      label="Search"
                      value="search"
                      style={{
                        color: tabValue === 'search' ? 'white' : colors.grey12,
                        textTransform: 'initial',
                      }}
                    />
                    <Tab
                      label="Custom Token"
                      value="custom"
                      style={{
                        color: tabValue === 'custom' ? 'white' : colors.grey12,
                        textTransform: 'initial',
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel className="p-2 h-100" value="search">
                  <SearchTab
                    onCancel={() => {
                      navigate(-1);
                    }}
                  />
                </TabPanel>
                <TabPanel className="p-2 h-100" value="custom">
                  <CustomTab
                    onCancel={() => {
                      navigate(-1);
                    }}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTokenScreen;
