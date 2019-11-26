import React from 'react';
import csv from 'csv';
import Container from '@material-ui/core/Container';
import { DropzoneArea } from 'material-ui-dropzone';
import { CurrencyContext } from '../context/CurrencyContext';
const dropzoneText = 'Drag Transactions CSV File Here';

export default function Dropzone(props) {
  let { state } = React.useContext(CurrencyContext);
  let { setTransactions } = props;
  const onDrop = acceptedFiles => {
    //let trans = [];
    acceptedFiles.forEach(file => {
      //let transactionId = 0;
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
          disabled={true}
          filesLimit={1}
          dropzoneText={dropzoneText}
          onChange={onDrop}
        />
      </Container>
    </div>
  );
}
