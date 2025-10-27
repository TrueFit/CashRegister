import { Box, Typography, Paper, Button } from '@mui/material'
import { getCurrencyConfig } from '../utils/currencies'

export default function DisplayScreen({ amountOwed, amountPaid, changeAmount, changeFormatted, wasRandomized, onMakeOwnChange, currency = 'USD' }) {
  const currencyConfig = getCurrencyConfig(currency)
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DisplayRow label="Amount Owed" value={formatAmount(amountOwed, currencyConfig.symbol)} />
        <DisplayRow label="Amount Paid" value={formatAmount(amountPaid, currencyConfig.symbol)} />

        {changeFormatted && (
          <Box sx={{ mt: 1, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Change {wasRandomized && '(Random Distribution)'}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFeatureSettings: '"tnum"' }}>
                {formatAmount(changeAmount, currencyConfig.symbol)}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.8, mb: 2 }}>
              {changeFormatted}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={onMakeOwnChange}
              fullWidth
              sx={{ whiteSpace: 'nowrap' }}
            >
              Make My Own Change
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

function DisplayRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, fontFeatureSettings: '"tnum"', textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
}

function formatAmount(value, symbol = '$') {
  if (value === null || value === undefined || value === '') {
    return `${symbol}0.00`
  }
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? `${symbol}0.00` : `${symbol}${num.toFixed(2)}`
}
