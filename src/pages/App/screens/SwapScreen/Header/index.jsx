import React from 'react';

//import mui
import { IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';

const Header = ({ status, statusGoBack }) => {
  return (
    <div className="d-flex flex-row align-items-center mt-4">
      {status == 'default' && (
        <>
          <div
            className="flex-fill text-white font-weight-bold text-center"
            style={
              {
                //  ...fonts.title2,
              }
            }
          >
            Swap
          </div>
        </>
      )}
      {status == 'confirm' && (
        <>
          <IconButton
            onClick={() => {
              statusGoBack(status);
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            <KeyboardArrowLeft style={{ fontSize: '18px', color: 'white' }} />
          </IconButton>
          <div
            className="text-white font-weight-bold flex-fill text-center"
            style={
              {
                // ...fonts.title2,
              }
            }
          >
            Confirm
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
