import { Router } from 'express';
import ChangeController from '../src/interfaces/controllers/ChangeController.js';

const router = Router();

router.get('/process-changes', async (req, res) => {
    const inputFile = './files/input.txt';
    const outputFile = './files/output.txt';

    try {
        await ChangeController.processFile(inputFile, outputFile);
        res.send('Process completed. Check the output file.');
    } catch (error) {
        // Maneja errores si ocurren durante el procesamiento
        console.error('Error processing the file:', error);
        res.status(500).send('Error occurred while processing the file.');
    }
});

export default router;
