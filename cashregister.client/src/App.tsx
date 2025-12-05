import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import './App.css';

interface ServerIsUp {
    status: string;
}
interface CurrencyOption {
    CurrencyCode: string;
    Name: string;
}

interface Change {
    denomination: string;
    count: number;
}

function App() {
    const defaultCurrencyOption1: CurrencyOption = { CurrencyCode: 'USD', Name: 'US Dollars' };
    const defaultCurrencyOption2: CurrencyOption = { CurrencyCode: 'EUR', Name: 'Euros' };
    const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([defaultCurrencyOption1, defaultCurrencyOption2]);

    const [serverIsUp, setServerIsUp] = useState<ServerIsUp[]>();

    const [due, setdDue] = useState<number | ''>('');
    const [paid, setPaid] = useState<number | ''>('');
    const [currency, setCurrency] = useState<string>('USD');
    const [message, setMessage] = useState<string>('');

    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [fileCurrency, setFileCurrency] = useState<string>('USD');
    const [fileResponse, setFileResponse] = useState<string>('');

    async function checkServerIsUp() {
        const response = await fetch('api/healthcheck');
        if (response.ok) {
            const data = await response.json();
            setServerIsUp(data);
        }
    }

    function formatChangeString(changeData: Change[]) {
        const denominationStrings = [];
        for (const item of changeData) {
            denominationStrings.push(item.count + ' ' + item.denomination)
        }

        return 'The change for this transaction is ' + denominationStrings.join(', ') + '.';
    }

    const onNumChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: Dispatch<SetStateAction<number | ''>>
    ) => {
        const value = e.target.value;
        const numValue = parseFloat(value);
        const decimalPart = value.split('.')[1] || '';

        if (!isNaN(numValue) && numValue > 0 && decimalPart.length <= 2) {
            setter(numValue);
        } else {
            setter('');
        }
    };

    const onCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(event.target.value);
    };

    const onFileCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFileCurrency(event.target.value);
    };

    const submitSingleTransaction = async (
        due: number | '',
        paid: number | '',
        currency: string,
        setMessage: (message: string) => void
    ) => {
        if ( due === '' || paid === '') {
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
                headers: {'Content-Type': 'application/json; charset=UTF-8',                },
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

    const submitTransactionFile = async (
        upload: File | null,
        currency: string,
        setFileResponse: (fileResponse: string) => void
    ) => {
        if (!upload) {
            setFileResponse('Please choose a txt file to upload.');
            return;
        }
        if (currency === '') {
            setMessage('Please choose your currency.');
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

    useEffect(() => {
        checkServerIsUp();
    }, []);

    const handleRefresh = () => {
        window.location.reload(); // Reloads the entire page
    };

    const contents = serverIsUp === undefined
        ? <p><em>The server is loading... Please <button onClick={handleRefresh}>Refresh Page</button> in a moment.</em></p>
        : <div className="transactionContainer">
            <div>
                <h2>Single Transaction</h2>
                <form>
                    <input 
                        type="number"
                        min={0.0}
                        step="0.01"
                        value={due}
                        onChange={(e) => onNumChange(e, setdDue)}
                        placeholder="Owed (ex: 4.29)"
                    />
                    <input
                        type="number"
                        min={0.0}
                        step="0.01"
                        value={paid}
                        onChange={(e) => onNumChange(e, setPaid)}
                        placeholder="Paid (ex: 5.00)"
                    />
                    <select value={currency} onChange={onCurrencyChange}>
                        <option value="">-- Please choose a currency --</option>
                        {currencyOptions.map((option) => (
                            <option key={option.CurrencyCode} value={option.CurrencyCode}>
                                {option.Name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() =>
                            submitSingleTransaction(
                                due,
                                paid,
                                currency,
                                message => setMessage(message)
                            )
                        }
                    >
                        Calculate Change
                    </button>
                </form>
                {message && (
                    <p>
                        {message}
                    </p>
                )}
            </div>
            <div>
                <h2>Batch Processing</h2>
                <form>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => setFileUpload(e.target.files ? e.target.files[0] : null)}
                    />
                    <select value={fileCurrency} onChange={onFileCurrencyChange}>
                        <option value="">-- Please choose a currency --</option>
                        {currencyOptions.map((option) => (
                            <option key={option.CurrencyCode} value={option.CurrencyCode}>
                                {option.Name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() =>
                            submitTransactionFile(
                                fileUpload,
                                fileCurrency,
                                fileResponse => setFileResponse(fileResponse)
                            )
                        }
                    >
                        Calculate Change
                    </button>
                </form>
                {fileResponse && (
                    <p>
                        {fileResponse}
                    </p>
                )}
            </div>
        </div>;

    return (
        <div>
            <h1 id="appHeader">Cash Register App</h1>
            <p>You may complete a single transaction or upload a file to batch process them.</p>
            {contents}
        </div>
    );
}

export default App;