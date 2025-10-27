import { useState } from 'react'
import { Box, Typography, Button, Paper, Alert } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import { calculateChange } from '../utils/cashRegister'

export default function FileUpload({ currency = 'USD', denominationSettings = {}, onBatchComplete, setGlobalProgress }) {
  const [status, setStatus] = useState(null)
  const [results, setResults] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = async (file) => {
    if (!file) return

    if (!file.name.endsWith('.txt')) {
      setStatus({
        type: 'error',
        message: 'Please upload a .txt file'
      })
      return
    }

    try {
      const text = await file.text()
      const lines = text.split(/\r?\n/).filter((line) => line.trim())

      const processed = []
      const total = lines.length
      setGlobalProgress?.({ active: true, value: 0 })

      for (let index = 0; index < lines.length; index++) {
        const line = lines[index]
        try {
          let lineCurrency = currency
          let lineContent = line.trim()

          const currencyMarkerMatch = lineContent.match(/^(USD|EUR|GBP):\s*(.+)$/)
          if (currencyMarkerMatch) {
            lineCurrency = currencyMarkerMatch[1]
            lineContent = currencyMarkerMatch[2]
          }

          const [owed, paid] = lineContent.split(',').map((v) => parseFloat(v.trim()))

          if (isNaN(owed) || isNaN(paid)) {
            throw new Error('Invalid number format')
          }

          const result = calculateChange(owed, paid, lineCurrency, denominationSettings)
          const changeText = formatBreakdownText(result.breakdown, lineCurrency)
          processed.push({
            line: index + 1,
            owed,
            paid,
            currency: lineCurrency,
            change: changeText,
            changeText,
            success: true
          })
        } catch (error) {
          processed.push({
            line: index + 1,
            error: error.message,
            success: false
          })
        }

        if (index % 50 === 0 || index === lines.length - 1) {
          const value = Math.round(((index + 1) / total) * 100)
          setGlobalProgress?.({ active: true, value })
          await new Promise((r) => setTimeout(r, 0))
        }
      }

      setResults(processed)
      setStatus({
        type: 'success',
        message: `Processed ${processed.length} transactions`
      })
      onBatchComplete?.(processed)
      setGlobalProgress?.({ active: false, value: 0 })
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Failed to process file: ${error.message}`
      })
      setGlobalProgress?.({ active: false, value: 0 })
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    await processFile(file)
    event.target.value = ''
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    await processFile(file)
  }

  const handleDownload = () => {
    if (!results) return

    const output = results
      .map((r) => (r.success ? r.changeText : `ERROR: ${r.error}`))
      .join('\n\n')

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `change-results-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Batch Processing
        </Typography>

        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: 2,
            borderStyle: 'dashed',
            borderColor: isDragging ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            bgcolor: isDragging ? 'action.hover' : 'transparent',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '& > *': {
              pointerEvents: isDragging ? 'none' : 'auto'
            }
          }}
        >
          <UploadFileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Drag and drop your .txt file here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Browse Files
            <input type="file" accept=".txt" hidden onChange={handleFileUpload} />
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Format: one transaction per line (owed, paid)
        </Typography>

        {status && (
          <Alert severity={status.type} onClose={() => setStatus(null)}>
            {status.message}
          </Alert>
        )}

        {results && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preview
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
              {results
                .map((r) => (r.success ? r.changeText : `ERROR: ${r.error}`))
                .join('\n\n')}
            </Paper>
          </Box>
        )}

        {results && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            fullWidth
          >
            Download Results
          </Button>
        )}
      </Box>
    </Paper>
  )
}

function formatBreakdownText(breakdown, currency) {
  if (!breakdown || breakdown.length === 0) return 'no change'

  const parts = breakdown.map((d) => formatPart(d, currency))
  return parts.join(',')
}

function formatPart(denom, currency) {
  const count = denom.count
  switch (currency) {
    case 'USD':
      return `${count} ${pluralizeUSD(denom, count)}`
    case 'EUR':
      return `${count} ${nameEUR(denom, count)}`
    case 'GBP':
      return `${count} ${nameGBP(denom, count)}`
    default:
      return `${count} ${denom.label}`
  }
}

function pluralizeUSD(denom, count) {
  let base = denom.wordForm
  if (!base) {
    if (denom.value >= 100) {
      const dollars = denom.value / 100
      base = dollars === 1 ? 'dollar' : 'dollar'
      return count === 1 ? base : `${base}s`
    }
    switch (denom.value) {
      case 25:
        base = 'quarter'
        break
      case 10:
        base = 'dime'
        break
      case 5:
        base = 'nickel'
        break
      case 1:
        base = 'penny'
        break
      default:
        base = denom.label
    }
  }
  if (base === 'penny') return count === 1 ? 'penny' : 'pennies'
  return count === 1 ? base : `${base}s`
}

function nameEUR(denom, count) {
  if (denom.type === 'bill') {
    return count === 1 ? `${denom.label} note` : `${denom.label} notes`
  }
  if (denom.value === 200 || denom.value === 100) {
    return count === 1 ? `${denom.label} coin` : `${denom.label} coins`
  }
  const cents = denom.value
  const base = `${cents}-cent coin`
  return count === 1 ? base : `${cents}-cent coins`
}

function nameGBP(denom, count) {
  if (denom.type === 'bill') {
    return count === 1 ? `${denom.label} note` : `${denom.label} notes`
  }
  if (denom.value === 200 || denom.value === 100) {
    return count === 1 ? `${denom.label} coin` : `${denom.label} coins`
  }
  if (denom.value === 1) return count === 1 ? 'penny' : 'pence'
  const pence = `${denom.value}p`
  return count === 1 ? `${pence} coin` : `${pence} coins`
}
