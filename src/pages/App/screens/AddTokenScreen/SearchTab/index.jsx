import React, { useState } from 'react';

//import components
import { PrimaryButton, TextButton } from '../../../components/Buttons';
import SingleInput from '../../../components/CustomInputs/SingleInput';

//import mui
import { Search, Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';

//import styles
import { fonts, colors } from '../../../styles';

const SearchTab = ({ onCancel }) => {
  const [addTokenLoading, setAddTokenLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  return (
    <div className="h-100 ml-2 mr-2 d-flex flex-column">
      <div className="flex-fill">
        <SingleInput
          value={searchText}
          onChangeValue={(value) => {
            setSearchText(value);
          }}
          label="Search"
          icon={<Search className="text-white" style={{ fontSize: '20px' }} />}
          icon2={
            searchText.length ? (
              <IconButton
                onClick={() => {
                  setSearchText('');
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
              >
                <Clear className="text-white" style={{ fontSize: '20px' }} />
              </IconButton>
            ) : (
              <></>
            )
          }
        />
        <div className="mt-4">
          <div
            className="font-weight-bold"
            style={{
              // ...fonts.para_semibold,
              color: colors.grey9,
            }}
          >
            Select Token
          </div>
        </div>
      </div>

      <div className="d-flex flex-row align-items-center justify-content-around w-100 mb-3">
        <TextButton
          className="m-0"
          text="Cancel"
          style={{ width: '160px' }}
          onClick={() => {
            onCancel();
          }}
        />
        <PrimaryButton
          className="m-0"
          loading={addTokenLoading}
          text={'Add Token'}
          onClick={() => {}}
          style={{ width: '160px' }}
        />
      </div>
    </div>
  );
};

export default SearchTab;
