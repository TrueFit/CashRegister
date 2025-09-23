import fs from 'fs';

export default class Writer {
    static writeFile = (filePath, content) => {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            console.error('Error writing to file:', error);
        }
    }
}
