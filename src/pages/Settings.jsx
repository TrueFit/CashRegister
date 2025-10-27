import { useState, useEffect } from 'react'
import { Box, Paper, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Divider, Alert, Checkbox } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CheckIcon from '@mui/icons-material/Check'
import { useOutletContext } from 'react-router-dom'
import { CURRENCIES } from '../utils/currencies'
import { getInitialDrawerState } from '../utils/cashRegister'

export default function Settings() {
  const { currency, setCurrency, setDrawerState, denominationSettings, setDenominationSettings } = useOutletContext()
  const [selectedCurrency, setSelectedCurrency] = useState(currency)

  useEffect(() => {
    setSelectedCurrency(currency)
  }, [currency])

  const handleCurrencySelection = (event) => {
    setSelectedCurrency(event.target.value)
  }

  const handleApplyCurrency = () => {
    setCurrency(selectedCurrency)
  }

  const handleResetTill = () => {
    setDrawerState(getInitialDrawerState(currency, denominationSettings))
  }

  const hasCurrencyChanged = selectedCurrency !== currency

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        <Paper sx={{ p: 4, border: 1, borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Settings
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
              Currency
            </FormLabel>
            <RadioGroup value={selectedCurrency} onChange={handleCurrencySelection}>
              {Object.values(CURRENCIES).map((curr) => (
                <FormControlLabel
                  key={curr.code}
                  value={curr.code}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {curr.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({curr.symbol})
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {hasCurrencyChanged && (
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleApplyCurrency}
              fullWidth
              sx={{ mt: 3 }}
            >
              Apply Currency Change
            </Button>
          )}

          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mt: 3,
              color: 'text.primary',
              bgcolor: 'transparent',
              borderColor: 'divider',
              '& .MuiAlert-icon': { color: 'text.secondary' }
            }}
          >
            {hasCurrencyChanged
              ? `Click "Apply Currency Change" to switch to ${CURRENCIES[selectedCurrency].name}.`
              : 'Currency changes apply across all pages. Your current till counts remain unchanged.'
            }
          </Alert>

          {currency === 'USD' && (
            <>
              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  USD Denomination Options
                </Typography>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={denominationSettings.use2DollarBill}
                        onChange={(e) =>
                          setDenominationSettings({
                            ...denominationSettings,
                            use2DollarBill: e.target.checked
                          })
                        }
                      />
                    }
                    label="Use $2 bills"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={denominationSettings.use1DollarCoin}
                        onChange={(e) =>
                          setDenominationSettings({
                            ...denominationSettings,
                            use1DollarCoin: e.target.checked
                          })
                        }
                      />
                    }
                    label="Use $1 coins"
                  />
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  These denominations will be used in batch file calculations. Till has minimal amounts by default.
                </Typography>
              </Box>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Till Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleResetTill}
              fullWidth
            >
              Reset Till to Defaults
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              This will restore the till to default denomination counts for {CURRENCIES[currency].name}.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
