import type { Change } from '.././types/types';

export const submitSingleTransaction = async (
        due: number | '',
        paid: number | '',
        currency: string,
        setMessage: (message: string) => void
    ) => {
        if (due === '' || paid === '') {
            setMessage('Please enter the amounts due and paid.');
            return;
        }
        if (currency === '') {
            setMessage('Please choose your currency.');
            return;
        }

        try {
            const response = await fetch('api/tilltransaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8', },
                body: JSON.stringify({ due, paid, currency })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData: Change[] = await response.json();
            setMessage(`${formatChangeString(responseData)}`);
        } catch (error) {
            setMessage('Error processing transaction: ' + error);
        }
};

function formatChangeString(changeData: Change[]) {
    const denominationStrings = [];
    for (const item of changeData) {
        denominationStrings.push(item.count + ' ' + item.denomination)
    }

    return 'The change for this transaction is ' + denominationStrings.join(', ') + '.';
}

export const submitTransactionFile = async (
    upload: File | null,
    currency: string,
    setFileResponse: (fileResponse: string) => void
) => {
    if (!upload) {
        setFileResponse('Please choose a txt file to upload.');
        return;
    }
    if (currency === '') {
        setFileResponse('Please choose your currency.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('currency', currency)
        formData.append('file', upload);

        const response = await fetch('api/filetransaction', {
            method: 'POST',
            headers: { 'Response-Type': 'blob', },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = blobUrl
        a.download = 'output.txt'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(blobUrl)

        setFileResponse('File processed and results downloaded');
    } catch (error) {
        setFileResponse('Error processing transaction file: ' + error);
    }
};