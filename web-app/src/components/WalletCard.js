import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex', borderRadius: "19px",backgroundColor:'red'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  }

}));

export default function WalletCard(props) {
  const classes = useStyles();

  return (
    <Card style={props.crdStyle}>
      <CardMedia
        component="img"
        className={classes.cover}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <span >
            {props.title}
          </span>
          <span color="textSecondary">
            {props.children}
          </span>
        </CardContent>
      </div>
    </Card>
  );
}
