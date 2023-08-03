import React from 'react';

//import mui
import { Button } from '@mui/material';
// import styles
import { colors, fonts, commonStyles } from '../../../styles';

const TextButton = ({ onClick, text, icon, ...rest }) => {
  return (
    <Button
      onClick={onClick}
      className={'btn-block font-weight-bold ' + rest.className || ''}
      style={Object.assign(rest.style || {}, { color: colors.primary5 })}
      startIcon={icon ? icon : <></>}
    >
      {text || ''}
    </Button>
  );
};

export default TextButton;
