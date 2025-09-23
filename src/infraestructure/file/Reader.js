import fs from 'fs';

export default class Reader {
    static readFile = (filePath) => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return data.split('\n').map(row => row.trim());
        } catch (error) {
            console.error('Error reading file:', error);
            return [];
        }
    }
}
