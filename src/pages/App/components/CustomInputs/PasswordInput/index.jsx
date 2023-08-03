import React, { useState } from 'react';

// import mui
import {
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';

//import styles
import {
  useTextFieldLabelStyles,
  useTextFieldStyles,
  useTextFieldInputStyles,
} from '../../../styles/mui/muiStyles';

import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordInput = ({ value, onChangeValue, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl className="w-100">
      <TextField
        classes={useTextFieldStyles()}
        label={label}
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        margin="normal"
        InputLabelProps={{
          classes: useTextFieldLabelStyles(),
        }}
        InputProps={{
          classes: useTextFieldInputStyles(),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff className="text-white" />
                ) : (
                  <Visibility className="text-white" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={value}
        onChange={(event) => {
          onChangeValue(event.target.value);
        }}
      />
    </FormControl>
  );
};

export default PasswordInput;
