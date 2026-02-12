import './FileUploadPage.css'
import { useState, useEffect } from 'react';
import {Tabs, TabList, Tab, TabPanel, Select, Option, Button, Table, Chip} from "@mui/joy";
import { apiGet, apiPut } from './utils/BackendService';
import type { Settings } from './models/Settings';
import type { Currency } from './models/Currency';
import type { Rule } from './models/Rule';

function SettingsPage(){

    const [setting, setSetting] = useState<Settings | null>(null);
    const [currencies, setCurrencies] = useState<Currency[] | null>(null);
    const [rules, setRules] = useState<Rule[] | null>(null);

    useEffect(() => {
        const fetchCurrentSettings = async () => {
            try {
                // TODO: Replace 1 with settings id if needed
                const response = await apiGet<Settings>('/Settings/1'); 
                if (response.error) {
                    console.error('Error fetching settings:', response.error);
                    return;
                }
                console.log('Settings data:', response.data);
                setSetting(response.data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        }

        const fetchSettingCurrencies = async () => {
            try {
                // TODO: Replace 1 with settings id if needed
                const response = await apiGet<Currency[]>('/Settings/1/Currencies'); 
                if (response.error) {
                    console.error('Error fetching settings:', response.error);
                    return;
                }
                console.log('Settings data:', response.data);
                setCurrencies(response.data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        }

        const fetchRules = async () => {
            try {
                const response = await apiGet<Rule[]>('/Rules'); 
                if (response.error) {
                    console.error('Error fetching rules:', response.error);
                    return;
                }
                console.log('Rules data:', response.data);
                setRules(response.data);
            } catch (error) {
                console.error('Error fetching rules:', error);
            }
        }

        // Fetch settings data from the backend when the component mounts
        fetchCurrentSettings();
        fetchSettingCurrencies()
        fetchRules();
    }, []);


    // Dropdown state
    const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | null>(null);

    useEffect(() => {
        if (setting && setting.currency) {
            setSelectedCurrencyId(setting.currency.id);
        }
    }, [setting]);

    // Save handler
    const handleSave = async () => {
        if (!setting || !currencies || selectedCurrencyId == null) return;
        const newCurrency = currencies.find(c => c.id === selectedCurrencyId);
        if (!newCurrency) return;
        const updatedSetting = { ...setting, currency: newCurrency };
        try {
            const response = await apiPut<Settings>('/Settings/1', updatedSetting);
            if (response.error) {
                console.error('Error saving settings:', response.error);
                return;
            }
            setSetting(response.data);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className='tabContainer'>
            <Tabs>
                <TabList>
                    <Tab>General</Tab>
                    <Tab>Rules</Tab>
                </TabList>
                <TabPanel value={0}>
                    <label htmlFor="select-button" id="select-label">Currency</label>
                    <Select
                        value={selectedCurrencyId ?? null}
                        onChange={(_, value) => setSelectedCurrencyId(value as number)}
                        placeholder="Select currency"
                        sx={{ minWidth: 240 }}
                        disabled={!currencies || currencies.length === 0}
                    >
                        {currencies && currencies.map(currency => (
                            <Option key={currency.id} value={currency.id}>
                                {currency.name}
                            </Option>
                        ))}
                    </Select>
                    <Button variant="solid" color="primary" sx={{ float: 'right', mt: 2 }} disabled={!selectedCurrencyId} onClick={handleSave}>
                        Save
                    </Button>
                </TabPanel>
                <TabPanel value={1}>
                    <Table aria-label="rules table" size="md" sx={{ minWidth: 600 }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rule Type</th>
                                <th>Rule Target</th>
                                <th>Mod Value</th>
                                <th>Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules && rules.length > 0 ? (
                                rules.map(rule => (
                                    <tr key={rule.id}>
                                        <td>{rule.name}</td>
                                        <td>{rule.ruleType}</td>
                                        <td>{rule.ruleTarget}</td>
                                        <td>{rule.modValue}</td>
                                        <td>
                                            {rule.enabled ? (
                                                <Chip color="success" size="sm">Yes</Chip>
                                            ) : (
                                                <Chip color="neutral" size="sm">No</Chip>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>No rules found.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default SettingsPage;