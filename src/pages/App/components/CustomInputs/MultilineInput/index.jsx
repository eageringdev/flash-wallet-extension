import React from 'react';

// import mui
import { FormControl, TextField } from '@mui/material';

//import styles
import {
  useTextFieldLabelStyles,
  useTextFieldStyles,
  useTextFieldInputStyles,
  useHelperTextStyles,
} from '../../../styles/mui/muiStyles';
import { colors } from '../../../styles';

const MultilineInput = ({
  value,
  onChangeValue,
  label,
  row = 4,
  editable = true,
}) => {
  return (
    <FormControl className="w-100">
      <TextField
        multiline
        rows={row}
        classes={useTextFieldStyles()}
        label={label}
        margin="normal"
        InputLabelProps={{
          classes: useTextFieldLabelStyles(),
        }}
        InputProps={{
          classes: useTextFieldInputStyles(),
          readOnly: !editable,
        }}
        value={value}
        onChange={(event) => {
          onChangeValue(event.target.value);
        }}
      />
    </FormControl>
  );
};

export default MultilineInput;
