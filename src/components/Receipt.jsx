import { useRef } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import { getCurrencyConfig } from '../utils/currencies'

export default function Receipt({ transaction, currency = 'USD' }) {
  const receiptRef = useRef(null)
  const currencyConfig = getCurrencyConfig(currency)

  if (!transaction) {
    return null
  }

  const { timestamp, amountOwed, amountPaid, changeFormatted, changeCents } = transaction

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=400,height=600')
    const receiptContent = receiptRef.current.innerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Source Code Pro', monospace;
              margin: 20px;
              max-width: 400px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        maxWidth: 400
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box ref={receiptRef} sx={{ fontFamily: '"Source Code Pro", monospace' }}>
          <Box sx={{ textAlign: 'center', pb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'inherit' }}>
              Creative Cash Draw Solutions
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
              {new Date(timestamp).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            <ReceiptLine label="Amount Owed" value={formatCurrency(amountOwed, currencyConfig.symbol)} />
            <ReceiptLine label="Amount Paid" value={formatCurrency(amountPaid, currencyConfig.symbol)} />
            <ReceiptLine label="Change" value={formatCurrency(changeCents / 100, currencyConfig.symbol)} emphasized />
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ mt: 2 }}
          fullWidth
        >
          Print Receipt
        </Button>
      </Box>
    </Paper>
  )
}

function ReceiptLine({ label, value, emphasized }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography
        variant={emphasized ? 'body1' : 'body2'}
        sx={{ fontWeight: emphasized ? 600 : 400, fontFamily: 'inherit' }}
      >
        {label}
      </Typography>
      <Typography
        variant={emphasized ? 'h6' : 'body2'}
        sx={{ fontWeight: emphasized ? 700 : 600, fontFeatureSettings: '"tnum"', fontFamily: 'inherit' }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function formatCurrency(value, symbol = '$') {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(num) ? `${symbol}0.00` : `${symbol}${num.toFixed(2)}`
}
