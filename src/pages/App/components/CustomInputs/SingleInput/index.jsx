import React from 'react';

// import mui
import { FormControl, InputAdornment, TextField } from '@mui/material';

//import styles
import {
  useTextFieldLabelStyles,
  useTextFieldStyles,
  useTextFieldInputStyles,
  useHelperTextStyles,
} from '../../../styles/mui/muiStyles';

const SingleInput = ({
  value,
  onChangeValue,
  label,
  editable = true,
  icon,
  icon2,
  placeholder,
  className,
}) => {
  return (
    <FormControl className={'w-100 ' + className}>
      <TextField
        placeholder={placeholder}
        classes={useTextFieldStyles()}
        label={label}
        margin="normal"
        InputLabelProps={{
          classes: useTextFieldLabelStyles(),
        }}
        InputProps={{
          classes: useTextFieldInputStyles(),
          readOnly: !editable,
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : (
            <></>
          ),
          endAdornment: icon2 ? (
            <InputAdornment position="start">{icon2}</InputAdornment>
          ) : (
            <></>
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

export default SingleInput;
