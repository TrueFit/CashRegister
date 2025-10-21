// Cash Register Web App - Frontend Logic
class CashRegisterWeb {
    constructor() {
        this.currentCountry = 'US';
        this.cashRegister = null;
        this.initializeCashRegister();
    }

    // Initialize cash register with default country
    initializeCashRegister() {
        this.cashRegister = new CashRegisterBuilder().setCountry(this.currentCountry).build();
    }

    // Calculate single change
    calculateSingleChange() {
        const owed = parseFloat(document.getElementById('owed').value);
        const paid = parseFloat(document.getElementById('paid').value);
        const resultDiv = document.getElementById('singleResult');

        if (isNaN(owed) || isNaN(paid)) {
            this.showResult('singleResult', 'Please enter valid numbers', 'error');
            return;
        }

        try {
            const change = this.cashRegister.calculateChange(owed, paid);
            const changeInCents = Math.round((paid - owed) * 100);
            
            let resultText = `Change: ${change}`;
            let resultType = 'success';

            if (changeInCents % 3 === 0 && changeInCents > 0) {
                resultText += '\n🎲 This is RANDOM change (amount divisible by 3)';
                resultType = 'info';
            } else if (changeInCents > 0) {
                resultText += '\n📐 This is MINIMUM change (greedy algorithm)';
            } else if (changeInCents === 0) {
                resultText += '\n✅ No change needed';
            }

            this.showResult('singleResult', resultText, resultType);
        } catch (error) {
            this.showResult('singleResult', `Error: ${error.message}`, 'error');
        }
    }

    // Select country
    selectCountry(countryCode) {
        this.currentCountry = countryCode;
        this.initializeCashRegister();

        // Update UI
        document.querySelectorAll('.country-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-country="${countryCode}"]`).classList.add('active');

        // Update country info
        const countryInfo = {
            'US': 'United States (USD) - Dollars, quarters, dimes, nickels, pennies',
            'COLOMBIA': 'Colombia (COP) - Pesos, bills and coins',
            'MEXICO': 'Mexico (MXN) - Pesos, bills and coins',
            'SPAIN': 'Spain (EUR) - Euros, bills and coins'
        };

        document.getElementById('countryInfo').textContent = `Selected: ${countryInfo[countryCode]}`;
    }

    // Run demo scenario
    runScenario(scenarioType) {
        const scenarios = {
            'normal': { owed: 2.12, paid: 3.00, description: 'Normal Change (Minimum)' },
            'small': { owed: 1.97, paid: 2.00, description: 'Small Change' },
            'random': { owed: 3.33, paid: 5.00, description: 'Random Change (Special)' },
            'none': { owed: 5.00, paid: 5.00, description: 'No Change' }
        };

        const scenario = scenarios[scenarioType];
        if (!scenario) return;

        try {
            const change = this.cashRegister.calculateChange(scenario.owed, scenario.paid);
            const changeInCents = Math.round((scenario.paid - scenario.owed) * 100);
            
            let resultText = `${scenario.description}\n`;
            resultText += `Input: $${scenario.owed} owed, $${scenario.paid} paid\n`;
            resultText += `Output: ${change}\n`;
            
            if (changeInCents % 3 === 0 && changeInCents > 0) {
                resultText += '🎲 Random change (divisible by 3)';
            } else if (changeInCents > 0) {
                resultText += '📐 Minimum change (greedy)';
            }

            this.showResult('scenarioResult', resultText, 'success');
        } catch (error) {
            this.showResult('scenarioResult', `Error: ${error.message}`, 'error');
        }
    }

    // Handle file upload
    handleFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const processBtn = document.getElementById('processBtn');
        
        if (fileInput.files.length > 0) {
            processBtn.disabled = false;
        } else {
            processBtn.disabled = true;
        }
    }

    // Process uploaded file
    processFile() {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showResult('fileResult', 'Please select a file first', 'error');
            return;
        }

        this.showLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const lines = content.split('\n').filter(line => line.trim());
                
                let results = [];
                let successCount = 0;
                let errorCount = 0;

                lines.forEach((line, index) => {
                    try {
                        const [owedStr, paidStr] = line.split(',').map(s => s.trim());
                        const owed = parseFloat(owedStr);
                        const paid = parseFloat(paidStr);
                        
                        if (isNaN(owed) || isNaN(paid)) {
                            throw new Error('Invalid numbers');
                        }

                        const change = this.cashRegister.calculateChange(owed, paid);
                        results.push(`${owedStr},${paidStr} → ${change}`);
                        successCount++;
                    } catch (error) {
                        results.push(`Line ${index + 1}: Error - ${error.message}`);
                        errorCount++;
                    }
                });

                const resultText = `Processed ${lines.length} transactions\n`;
                const resultType = errorCount === 0 ? 'success' : 'info';
                
                this.showResult('fileResult', resultText, resultType);
                this.showOutput('fileOutput', results.join('\n'));
                
            } catch (error) {
                this.showResult('fileResult', `Error processing file: ${error.message}`, 'error');
            } finally {
                this.showLoading(false);
            }
        };

        reader.readAsText(file);
    }

    // Download sample file
    downloadSample() {
        const sampleContent = `2.12,3.00
1.97,2.00
3.33,5.00
5.00,5.00
10.50,15.00`;

        const blob = new Blob([sampleContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_transactions.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Run batch test
    runBatchTest() {
        this.showLoading(true);
        
        const testCases = [
            { owed: 2.12, paid: 3.00, description: 'Normal change' },
            { owed: 1.97, paid: 2.00, description: 'Small change' },
            { owed: 3.33, paid: 5.00, description: 'Random change' },
            { owed: 5.00, paid: 5.00, description: 'No change' },
            { owed: 99.99, paid: 100.00, description: 'Large amount' },
            { owed: 0.01, paid: 0.02, description: 'Tiny change' }
        ];

        let results = [];
        let successCount = 0;
        let errorCount = 0;

        testCases.forEach((testCase, index) => {
            try {
                const change = this.cashRegister.calculateChange(testCase.owed, testCase.paid);
                const changeInCents = Math.round((testCase.paid - testCase.owed) * 100);
                
                let resultText = `${index + 1}. ${testCase.description}`;
                resultText += `\n   Input: $${testCase.owed} owed, $${testCase.paid} paid`;
                resultText += `\n   Output: ${change}`;
                
                if (changeInCents % 3 === 0 && changeInCents > 0) {
                    resultText += '\n   🎲 Random change (divisible by 3)';
                } else if (changeInCents > 0) {
                    resultText += '\n   📐 Minimum change (greedy)';
                }
                
                results.push(resultText);
                successCount++;
            } catch (error) {
                results.push(`${index + 1}. ${testCase.description} - Error: ${error.message}`);
                errorCount++;
            }
        });

        const resultText = `Batch test completed: ${successCount} successful, ${errorCount} errors`;
        const resultType = errorCount === 0 ? 'success' : 'info';
        
        this.showResult('batchResult', resultText, resultType);
        this.showOutput('batchOutput', results.join('\n\n'));
        this.showLoading(false);
    }

    // Test all countries
    runCountryTest() {
        this.showLoading(true);
        
        const countries = ['US', 'COLOMBIA', 'MEXICO', 'SPAIN'];
        const testAmount = 10.50;
        const paidAmount = 15.00;
        
        let results = [];
        
        countries.forEach(country => {
            try {
                const countryCashRegister = new CashRegisterBuilder().setCountry(country).build();
                const change = countryCashRegister.calculateChange(testAmount, paidAmount);
                results.push(`${country}: ${change}`);
            } catch (error) {
                results.push(`${country}: Error - ${error.message}`);
            }
        });

        this.showResult('batchResult', 'Country test completed', 'success');
        this.showOutput('batchOutput', results.join('\n'));
        this.showLoading(false);
    }

    // Utility methods
    showResult(elementId, text, type) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = `result ${type}`;
        element.style.display = 'block';
    }

    showOutput(elementId, text) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.style.display = 'block';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }
}

// Global functions for HTML onclick handlers
let cashRegisterApp;

function calculateSingleChange() {
    cashRegisterApp.calculateSingleChange();
}

function clearSingleForm() {
    document.getElementById('owed').value = '';
    document.getElementById('paid').value = '';
    document.getElementById('singleResult').style.display = 'none';
}

function selectCountry(countryCode) {
    cashRegisterApp.selectCountry(countryCode);
}

function runScenario(scenarioType) {
    cashRegisterApp.runScenario(scenarioType);
}

function handleFileUpload() {
    cashRegisterApp.handleFileUpload();
}

function processFile() {
    cashRegisterApp.processFile();
}

function downloadSample() {
    cashRegisterApp.downloadSample();
}

function runBatchTest() {
    cashRegisterApp.runBatchTest();
}

function runCountryTest() {
    cashRegisterApp.runCountryTest();
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    cashRegisterApp = new CashRegisterWeb();
});
