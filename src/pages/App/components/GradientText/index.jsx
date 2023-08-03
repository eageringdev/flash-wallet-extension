// import mui
import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const GradientText = withStyles({
  root: {
    background:
      '-webkit-linear-gradient(10deg, #A9CDFF 0%, #72F6D1 20%, #A0ED8D 40%, #FED365 60%, #FAA49E 80%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
})(Typography);

export default GradientText;
