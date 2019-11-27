import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CSVLink } from 'react-csv';
import Fab from '@material-ui/core/Fab';
import DescriptionIcon from '@material-ui/icons/Description';
import { CurrencyContext } from '../../context/CurrencyContext';

const useStyles = makeStyles(theme => ({
  downloadBtn: {
    background: 'linear-gradient(45deg, #8bfe6b 30%, #04f700 90%)',
    color: 'black',
    margin: theme.spacing(5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function formatChangeExport(data) {
  let csv_response = [];
  data.forEach(trans => {
    csv_response.push([trans['change_due'].join(' ,')]);
  });
  return csv_response;
}

export default function ResultsDownload() {
  const classes = useStyles();
  let { state } = React.useContext(CurrencyContext);
  if (state.changeDue.length > 0) {
    let change = formatChangeExport(state.changeDue);
    return (
      <CSVLink data={change}>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          className={classes.downloadBtn}
        >
          <DescriptionIcon className={classes.extendedIcon} />
          Download Change as CSV
        </Fab>
      </CSVLink>
    );
  }
  return null;
}
