import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import './App.css';

interface ServerIsUp {
    status: string;
}

interface Change {
    denomination: string;
    count: number;
}

function App() {
    const [serverIsUp, setServerIsUp] = useState<ServerIsUp[]>();
    const [due, setdDue] = useState<number | ''>('');
    const [paid, setPaid] = useState<number | ''>('');
    const [currency, setCurrency] = useState<string>('USD');
    const [message, setMessage] = useState<string>('');

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
            denominationStrings.push(item.count + ' ' + item.denomination + (item.count > 1 ? 's' : ''))
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

    useEffect(() => {
        checkServerIsUp();
    }, []);

    const contents = serverIsUp === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
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
                <p>TODO</p>
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