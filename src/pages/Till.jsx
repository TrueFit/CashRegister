import { useState } from 'react'
import { Box, Button, TextField, Typography, Alert } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useOutletContext } from 'react-router-dom'
import NumberPad from '../components/NumberPad'
import DisplayScreen from '../components/DisplayScreen'
import CashDrawer from '../components/CashDrawer'
import Receipt from '../components/Receipt'
import { calculateChange, updateDrawerAfterTransaction } from '../utils/cashRegister'
import { getCurrencyConfig } from '../utils/currencies'

export default function Till() {
  const { drawerState, setDrawerState, currency, denominationSettings } = useOutletContext()
  const currencyConfig = getCurrencyConfig(currency)
  const [amountOwedCents, setAmountOwedCents] = useState(0)
  const [amountPaidCents, setAmountPaidCents] = useState(0)
  const [activeField, setActiveField] = useState('owed')
  const [changeResult, setChangeResult] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [error, setError] = useState(null)
  const [interactiveMode, setInteractiveMode] = useState(false)
  const [customChange, setCustomChange] = useState([])
  const [changeNeeded, setChangeNeeded] = useState(0)

  const formatCentsDisplay = (cents) => {
    return `${currencyConfig.symbol}${(cents / 100).toFixed(2)}`
  }

  const handleNumberInput = (value) => {
    setError(null)
    const setter = activeField === 'owed' ? setAmountOwedCents : setAmountPaidCents
    const current = activeField === 'owed' ? amountOwedCents : amountPaidCents

    if (value === '.') return

    const digit = parseInt(value)
    if (isNaN(digit)) return

    const newCents = current * 10 + digit
    if (newCents > 9999999) return

    setter(newCents)
  }

  const handleClear = () => {
    setError(null)
    if (activeField === 'owed') {
      setAmountOwedCents(0)
    } else {
      setAmountPaidCents(0)
    }
  }

  const handleEnter = () => {
    setError(null)

    if (activeField === 'owed' && amountOwedCents > 0) {
      setActiveField('paid')
      return
    }

    if (amountOwedCents === 0 || amountPaidCents === 0) {
      setError('Please enter both owed and paid amounts')
      return
    }

    const owed = amountOwedCents / 100
    const paid = amountPaidCents / 100

    try {
      const result = calculateChange(owed, paid, currency, denominationSettings)
      setChangeResult(result)
      setChangeNeeded(result.changeCents)

      const newDrawerState = updateDrawerAfterTransaction(drawerState, result.breakdown)
      setDrawerState(newDrawerState)

      setTransaction({
        timestamp: Date.now(),
        amountOwed: owed,
        amountPaid: paid,
        changeFormatted: result.formatted,
        changeCents: result.changeCents
      })
    } catch (err) {
      setError(err.message)
      setChangeResult(null)
    }
  }

  const handleMakeOwnChange = () => {
    if (changeResult) {
      setInteractiveMode(true)
      setCustomChange([])
      setDrawerOpen(true)
    }
  }

  const handleDenominationSelect = (denom) => {
    const existing = customChange.find(c => c.value === denom.value)
    if (existing) {
      setCustomChange(customChange.map(c =>
        c.value === denom.value ? { ...c, count: c.count + 1 } : c
      ))
    } else {
      setCustomChange([...customChange, { ...denom, count: 1 }])
    }
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)

    if (interactiveMode) {
      const totalSelected = customChange.reduce((sum, item) => sum + item.value * item.count, 0)

      if (totalSelected === changeNeeded && customChange.length > 0) {
        const formatted = customChange
          .map(({ label, count }) => `${label} x ${count}`)
          .join(', ')

        setChangeResult(prev => ({ ...prev, formatted, wasRandomized: false }))

        const newDrawerState = updateDrawerAfterTransaction(drawerState, customChange)
        setDrawerState(newDrawerState)
      }

      setInteractiveMode(false)
      setCustomChange([])
    }
  }

  const handleCompleteTransaction = () => {
    setAmountOwedCents(0)
    setAmountPaidCents(0)
    setChangeResult(null)
    setError(null)
    setActiveField('owed')
    setInteractiveMode(false)
    setCustomChange([])
    setChangeNeeded(0)
  }

  const handleCancelTransaction = () => {
    if (changeResult && changeResult.breakdown) {
      const restoredDrawerState = { ...drawerState }
      for (const { value, count } of changeResult.breakdown) {
        restoredDrawerState[value] = (restoredDrawerState[value] || 0) + count
      }
      setDrawerState(restoredDrawerState)
    }

    setAmountOwedCents(0)
    setAmountPaidCents(0)
    setChangeResult(null)
    setError(null)
    setActiveField('owed')
    setInteractiveMode(false)
    setCustomChange([])
    setChangeNeeded(0)
    setTransaction(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          maxWidth: 1280,
          width: '100%'
        }}
      >
        <Box sx={{ flex: '1 1 300px', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Transaction
            </Typography>

            <TextField
              label="Amount Owed"
              value={formatCentsDisplay(amountOwedCents)}
              onFocus={() => setActiveField('owed')}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { textAlign: 'right', fontFeatureSettings: '"tnum"' }
                }
              }}
              sx={{
                '& input': {
                  bgcolor: activeField === 'owed' ? 'action.selected' : 'transparent'
                }
              }}
            />

            <TextField
              label="Amount Paid"
              value={formatCentsDisplay(amountPaidCents)}
              onFocus={() => setActiveField('paid')}
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { textAlign: 'right', fontFeatureSettings: '"tnum"' }
                }
              }}
              sx={{
                '& input': {
                  bgcolor: activeField === 'paid' ? 'action.selected' : 'transparent'
                }
              }}
            />

            <DisplayScreen
              amountOwed={amountOwedCents / 100}
              amountPaid={amountPaidCents / 100}
              changeAmount={changeResult?.changeCents ? changeResult.changeCents / 100 : 0}
              changeFormatted={changeResult?.formatted}
              wasRandomized={changeResult?.wasRandomized}
              onMakeOwnChange={handleMakeOwnChange}
              currency={currency}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" color="error" onClick={handleCancelTransaction} fullWidth>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleCompleteTransaction} fullWidth>
                Complete
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 300px', maxWidth: 400 }}>
          <NumberPad onInput={handleNumberInput} onClear={handleClear} onEnter={handleEnter} />
        </Box>

        <Box sx={{ flex: '1 1 300px', maxWidth: 400 }}>
          {transaction && <Receipt transaction={transaction} currency={currency} />}
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1280, width: '100%' }}>
        <Button
          variant="contained"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={() => setDrawerOpen(true)}
          fullWidth
          size="large"
        >
          Open Till
        </Button>
      </Box>

      <CashDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        drawerState={drawerState}
        currency={currency}
        denominationSettings={denominationSettings}
        interactiveMode={interactiveMode}
        changeNeeded={changeNeeded}
        customChange={customChange}
        onDenominationSelect={handleDenominationSelect}
      />
    </Box>
  )
}
