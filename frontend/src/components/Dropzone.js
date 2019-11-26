import React, { useCallback, useState, useEffect } from 'react';
import csv from 'csv';
import Container from '@material-ui/core/Container';
import { DropzoneArea } from 'material-ui-dropzone';

export default function Dropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    //let trans = [];
    acceptedFiles.forEach(file => {
      //let transactionId = 0;
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => alert('file reading has failed');
      reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
          props.setTransactions(data);
        });
      };
      reader.readAsText(file);
    });
  }, []);

  return (
    <div className="container">
      <Container>
        <DropzoneArea onChange={onDrop} />
        <p>Drag 'n' drop CSV Files Here</p>
      </Container>
    </div>
  );
}
