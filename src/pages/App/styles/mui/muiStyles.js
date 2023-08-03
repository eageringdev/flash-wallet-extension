import { makeStyles } from '@mui/styles';
import { colors, fonts } from '../index';

const useTextFieldStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${colors.grey12} !important`,
      borderRadius: '8px !important',
    },
    '& .MuiOutlinedInput-notchedOutline:hover': {
      borderColor: `${colors.grey12} !important`,
      borderRadius: '8px !important',
    },
    '& .MuiOutlinedInput-notchedOutline:focused': {
      borderColor: `${colors.grey12} !important`,
      borderRadius: '8px !important',
    },
  },
  error: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${colors.red5} !important`,
    },
    '& .MuiOutlinedInput-notchedOutline:hover': {
      borderColor: `${colors.red5} !important`,
    },
    '& .MuiOutlinedInput-notchedOutline:focused': {
      borderColor: `${colors.red5} !important`,
    },
  },
}));

const useTextFieldLabelStyles = makeStyles((theme) => ({
  root: {
    '& ': {
      color: `${colors.grey12} !important`,
      // ...fonts.caption_small12_16_regular,
    },
  },
}));

const useTextFieldInputStyles = makeStyles((theme) => ({
  root: {
    '& ': {
      color: `white !important`,
      // ...fonts.para_semibold,
    },
  },
}));

// const useSwitchStyles = makeStyles((theme) => ({
//   root: {
//     '& .MuiSwitch-switchBase + .MuiSwitch-track': {
//       backgroundColor: colors.grey12,
//     },
//     '& .MuiSwitch-switchBase.Mui-checked': {
//       color: colors.primary5,
//       '&:hover': {
//         backgroundColor: alpha(
//           colors.primary5,
//           theme.palette.action.hoverOpacity
//         ),
//       },
//     },
//     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//       backgroundColor: colors.primary5,
//     },
//   },
// }));

const useLegacyButtonStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      border: '2px solid red',
      transitionDuration: '0.8s',
    },
    '&:focused': {
      border: '2px solid red',
      transitionDuration: '0.8s',
    },
  },
}));

const useBlurStyles = makeStyles((theme) => ({
  backDrop: {
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(100,0,30,0.4)',
  },
}));

const useTabStyles = makeStyles((theme) => ({
  root: {
    '&': {
      color: colors.grey12,
      borderWidth: '0px',
      textTransform: 'initial',
    },
    '&.Mui-selected': {
      color: 'white',
      borderBottomWidth: '2px',
      borderColor: 'white',
      textTransform: 'initial',
    },
  },
}));

const useTabsStyle = makeStyles((theme) => ({
  root: {
    '& .MuiTabs-indicator': {
      backgroundColor: 'white',
    },
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 340,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
  backgroundColor: colors.grey24,
  maxHeight: '500px',
  overflow: 'auto',
};

export {
  useTextFieldStyles,
  useTextFieldLabelStyles,
  useTextFieldInputStyles,
  // useSwitchStyles,
  useLegacyButtonStyles,
  useBlurStyles,
  modalStyle,
  useTabStyles,
  useTabsStyle,
};
