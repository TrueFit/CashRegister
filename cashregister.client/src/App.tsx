import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import './App.css';
import { submitSingleTransaction, submitTransactionFile, } from './utilities/apiHandlers';
import type { ServerIsUp, CurrencyOption, } from './types/types';

function App() {
    const [serverIsUp, setServerIsUp] = useState<ServerIsUp[]>();

    async function checkServerIsUp() {
        const response = await fetch('api/healthcheck');
        if (response.ok) {
            const data = await response.json();
            setServerIsUp(data);
        }
    }

    const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);

    async function getCurrencyOptions() {
        const response = await fetch('api/currencyoptions');
        if (response.ok) {
            const currencyData: [] = await response.json();
            const formattedCurrencyOptions = [];
            currencyData.forEach((item) => {
                formattedCurrencyOptions.push({
                        Name: item.name,
                        CurrencyCode: item.currencyCode
                })
            })
            setCurrencyOptions(formattedCurrencyOptions);
        }
    }

    const [due, setdDue] = useState<number | ''>('');
    const [paid, setPaid] = useState<number | ''>('');
    const [currency, setCurrency] = useState<string>('USD');
    const [message, setMessage] = useState<string>('');

    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [fileCurrency, setFileCurrency] = useState<string>('USD');
    const [fileResponse, setFileResponse] = useState<string>('');

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

    useEffect(() => {
        checkServerIsUp();
        getCurrencyOptions();
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
            <hr></hr>
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