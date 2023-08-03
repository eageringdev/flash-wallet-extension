import React from 'react';

import { Switch } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { colors } from '../../styles';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
    backgroundColor: colors.grey12,
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: colors.primary5,
    '&:hover': {
      backgroundColor: alpha(
        colors.primary5,
        theme.palette.action.hoverOpacity
      ),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: colors.primary5,
  },
}));

export default CustomSwitch;
