import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';
import {MAIN_COLOR} from "../common/sharedFunctions"

function CircularLoading() {

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent={'center'}
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress style={{color:MAIN_COLOR}} />
    </Grid>
  )
}

export default CircularLoading;