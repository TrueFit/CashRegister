import './FileUploadPage.css'
import { useState, useRef } from 'react';
import {Button, Stack, Card, CardContent, CardOverflow, Typography, Modal, ModalClose, ModalDialog} from "@mui/joy";
import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SettingsPage from './SettingsPage';
import { apiPost } from './utils/BackendService';
import type { CalculationResult } from './models/CalculationResult';

function FileUploadPage() {

    const [userFile, setUserFile] = useState<File | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [openResultsModal, setOpenResultsModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [calculationResult, setCalculationResult] = useState<string | undefined | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUserFile(e.target.files[0]);
        }
    };

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    const handleDownload = () => {
        if (!calculationResult) {
            console.log("No calculation result to download");
            return;
        } 
        try {
            const blob = new Blob([calculationResult], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'calculation_results.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    const handleUpload = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!userFile) {
            console.log("No file selected");
            return;
        }
        try {
            // Prepare form data for file upload
            const formData = new FormData();
            formData.append('InputFile', userFile);
            const response = await apiPost<CalculationResult>('/Calculate', formData);
            if (response.error) {
                console.error('Error uploading file:', response.error);
                alert('Failed to upload file. Please try again.');
            } else {
                console.log('Upload response:', response.data);
                alert('File uploaded successfully!');
                let results = response.data as CalculationResult;
                setCalculationResult(results?.calculationResults);
                setOpenResultsModal(true);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        }
    };

    return (
        <div className="FileUploadPage">
            <Stack direction="column" spacing={0}>
                <SettingsOutlined style={{ fontSize: 24, marginLeft:'95%'}} onClick={() => setOpenModal(true)}/>
                <Card
                    variant="outlined"
                    className="fileUploadDivContiner"
                    onClick={handleContainerClick}
                    sx={{ maxWidth: 480, cursor: 'pointer' }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="fileInput"
                        accept='.csv'
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />

                    <CardContent>
                        {!userFile ? (
                            <Stack direction="column" spacing={1} alignItems="center" className='cardContentStack'>
                                <FileUploadOutlined style={{ fontSize: 64 }} />
                                <Typography level="h2">Upload CSV File</Typography>
                                <Typography level="h4">Click Here</Typography>
                            </Stack>
                        ) : (
                            <div className='fileNameDiv'>
                                <Stack direction="column" spacing={1} alignItems="center" className='cardContentStack'>
                                    <FileUploadOutlined style={{ fontSize: 64 }} />
                                    <Typography level="h4">{"File: " + userFile?.name}</Typography>
                                </Stack>
                            </div>
                        )}
                    </CardContent>

                    {userFile && (
                        <CardOverflow >
                            <Button id="uploadButton" className='uploadButton' onClick={handleUpload}>Upload</Button>
                        </CardOverflow>
                    )}
                </Card>
            </Stack>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog
                    color="primary"
                    layout="center"
                    variant="outlined"
                    sx={{ width: 800, maxWidth: '90vw', height: 600, maxHeight: '90vh' }}
                >
                    <ModalClose />
                    <Typography level="h2">Settings</Typography>
                    <SettingsPage />
                </ModalDialog>
            </Modal>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={openResultsModal}
                onClose={() => setOpenResultsModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog
                    color="primary"
                    layout="center"
                    variant="outlined"
                    sx={{ width: 800, maxWidth: '90vw', height: 500, maxHeight: '90vh' }}
                >
                    <ModalClose />
                    <Typography level="h2">Results</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{calculationResult}</pre>
                    <Button variant="solid" size='sm' color="primary" sx={{ width:"20%", float: 'right', ml: 75, mt: 15 }} onClick={handleDownload}>
                        Download
                    </Button>
                </ModalDialog>
            </Modal>
        </div>
    );
}

export default FileUploadPage;