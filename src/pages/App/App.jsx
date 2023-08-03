import React from 'react';
import './App.scss';

//import boostrap
import 'bootstrap/dist/css/bootstrap.min.css';

//import router
import MainRouter from './router';

//import snackbar provider
import { SnackbarProvider, useSnackbar } from 'notistack';
//import mui
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

function SnackbarCloseButton({ snackbarKey }) {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)}>
      <Close />
    </IconButton>
  );
}

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      action={(snackbarKey) => (
        <SnackbarCloseButton snackbarKey={snackbarKey} />
      )}
    >
      <MainRouter />
    </SnackbarProvider>
  );
};

export default App;
