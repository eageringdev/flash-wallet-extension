import React from 'react';

// import styles
import { colors, fonts, commonStyles } from '../../../styles';

//import mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

const PrimaryButton = ({
  onClick,
  enableFlag,
  text,
  icon,
  icon2,
  loading,
  ...rest
}) => {
  const BootstrapButton = styled(LoadingButton)({
    '&': {
      color: 'black',
      backgroundColor: colors.primary5,
      // ...fonts.btn_large_normal,
      minHeight: '36px',
    },
    '&:hover': {
      backgroundColor: colors.primary6,
    },
    '& .MuiLoadingButton-loadingIndicator': {
      color: colors.primary5,
    },
    '&:disabled': {
      backgroundColor: colors.grey23,
      color: colors.grey18,
    },
  });

  return (
    <BootstrapButton
      onClick={onClick}
      loading={typeof loading === 'boolean' && loading}
      disabled={typeof enableFlag === 'boolean' ? !enableFlag : false}
      className={'btn-block font-weight-bold  ' + rest.className || ''}
      startIcon={icon ? icon : <></>}
      endIcon={icon2 ? icon2 : <></>}
      style={rest.style || {}}
    >
      {loading ? '' : text || 'No Text'}
    </BootstrapButton>
  );
};

export default PrimaryButton;
