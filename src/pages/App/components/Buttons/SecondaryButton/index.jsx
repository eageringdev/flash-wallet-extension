import React from 'react';

// import styles
import { colors, fonts, commonStyles } from '../../../styles';

//import mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

const SecondaryButton = ({
  onClick,
  enableFlag,
  text,
  icon,
  icon2,
  loading,
  ...rest
}) => {
  const BootstrapButton = styled(LoadingButton)({
    color: colors.primary5,
    backgroundColor: colors.grey22,
    // ...fonts.btn_large_normal,
    minHeight: '36px',
    '&:hover': {
      backgroundColor: colors.grey23,
    },
    '& .MuiLoadingButton-loadingIndicator': {
      color: colors.primary5,
    },
    '& .MuiButton-startIcon': {
      margin: '5px',
    },
  });

  return (
    <BootstrapButton
      onClick={onClick}
      loading={typeof loading === 'boolean' && loading}
      disabled={typeof enableFlag === 'boolean' ? !enableFlag : false}
      className={'btn-block font-weight-bold ' + rest.className || ''}
      startIcon={icon ? icon : <></>}
      endIcon={icon2 ? icon2 : <></>}
      style={rest.style || {}}
    >
      {loading ? '' : text || 'No Text'}
    </BootstrapButton>
  );
};

export default SecondaryButton;
