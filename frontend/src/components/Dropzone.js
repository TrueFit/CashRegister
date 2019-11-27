import React from 'react';
import csv from 'csv';
import Container from '@material-ui/core/Container';
import { DropzoneArea } from 'material-ui-dropzone';
import { CurrencyContext } from '../context/CurrencyContext';

/*
  Dropzone component allows csv files to be dropped on to screen
  Files are looped and csv data is parsed and returned to the CurrencyContext
*/
export default function Dropzone(props) {
  let { state } = React.useContext(CurrencyContext);
  let { setTransactions } = props;
  const dropzoneText = 'Drag Transactions CSV File Here';
  // Handle files dropped
  const onDrop = acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => alert('file reading has failed');
      reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
          setTransactions(data);
        });
      };
      reader.readAsText(file);
    });
  };

  if (state.changeDue.length > 0) {
    return null;
  }
  return (
    <div className="container">
      <Container>
        <DropzoneArea
          filesLimit={1}
          dropzoneText={dropzoneText}
          onChange={onDrop}
        />
      </Container>
    </div>
  );
}
