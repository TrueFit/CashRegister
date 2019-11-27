import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Hero() {
  const classes = useStyles();
  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Cash Register
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Drag N' Drop a CSV file into the area below to detemine the change to
          be given to the customer.
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Data must contain a single transaction per row formated as : amount
          owed and ammount due seperated by a comma
        </Typography>
      </Container>
    </div>
  );
}
