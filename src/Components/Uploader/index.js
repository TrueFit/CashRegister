import React, {Component} from 'react';
import Dropzone from 'react-dropzone'

// https://github.com/react-dropzone/react-dropzone
class Uploader extends Component {
    onDrop(files) {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileAsBinaryString = reader.result;
                // do whatever you want with the file content
                this.props.handleUploadFile(fileAsBinaryString);
            };
            reader.readAsBinaryString(file);
        });
    }

    render() {
        return (
            <Dropzone onDrop={this.onDrop.bind(this)}>
                <p>Upload your own .txt. file of transactions</p>
            </Dropzone>
        );
    }
}

export default Uploader;
