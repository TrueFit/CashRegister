import { Box, Typography, Drawer, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { getFilteredDenominations, resolveDenominationConflicts } from '../utils/currencies'
import { calculateTillTotal, formatTillTotal } from '../utils/tillCalculator'

export default function CashDrawer({
  open,
  onClose,
  drawerState,
  currency = 'USD',
  denominationSettings = {},
  interactiveMode = false,
  changeNeeded = 0,
  customChange = [],
  onDenominationSelect
}) {
  const denominations = resolveDenominationConflicts(
    getFilteredDenominations(currency, denominationSettings)
  )
  const remainingChange = changeNeeded - customChange.reduce((sum, item) => sum + item.value * item.count, 0)
  const tillTotal = calculateTillTotal(drawerState)

  const getViableOptions = () => {
    if (!interactiveMode || remainingChange <= 0) return []

    return denominations.filter(denom => {
      const available = drawerState[denom.value] || 0
      const currentCount = customChange.find(c => c.value === denom.value)?.count || 0
      return available > currentCount && denom.value <= remainingChange
    })
  }

  const viableOptions = getViableOptions()
  const isComplete = interactiveMode && remainingChange === 0

  const handleComplete = () => {
    if (isComplete) {
      onClose()
    }
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: '70vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }
      }}
    >
      <Box sx={{ p: 3, maxWidth: 1280, mx: 'auto', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Till: {formatTillTotal(tillTotal)}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {interactiveMode && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Remaining to select: <strong>${(remainingChange / 100).toFixed(2)}</strong>
            </Typography>
            {isComplete && (
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                fullWidth
                onClick={handleComplete}
                sx={{ mt: 1 }}
              >
                Complete Selection
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DenominationSection
            title="Bills"
            items={denominations.filter((d) => d.type === 'bill')}
            drawerState={drawerState}
            interactiveMode={interactiveMode}
            viableOptions={viableOptions}
            customChange={customChange}
            onDenominationSelect={onDenominationSelect}
          />
          <DenominationSection
            title="Coins"
            items={denominations.filter((d) => d.type === 'coin')}
            drawerState={drawerState}
            interactiveMode={interactiveMode}
            viableOptions={viableOptions}
            customChange={customChange}
            onDenominationSelect={onDenominationSelect}
          />
        </Box>
      </Box>
    </Drawer>
  )
}

function DenominationSection({ title, items, drawerState, interactiveMode, viableOptions, customChange, onDenominationSelect }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {items.map((denom) => {
          const isViable = viableOptions.some(v => v.value === denom.value)
          const selectedCount = customChange.find(c => c.value === denom.value)?.count || 0

          return (
            <DenominationRow
              key={denom.value}
              label={denom.label}
              count={drawerState[denom.value] || 0}
              interactiveMode={interactiveMode}
              isViable={isViable}
              selectedCount={selectedCount}
              onSelect={() => onDenominationSelect?.(denom)}
            />
          )
        })}
      </Box>
    </Box>
  )
}

function DenominationRow({ label, count, interactiveMode, isViable, selectedCount, onSelect }) {
  const isClickable = interactiveMode && isViable

  return (
    <Box
      onClick={isClickable ? onSelect : undefined}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        bgcolor: isViable ? 'primary.main' : 'background.default',
        color: isViable ? 'primary.contrastText' : 'text.primary',
        borderRadius: 1,
        border: 1,
        borderColor: isViable ? 'primary.main' : 'divider',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': isClickable ? {
          opacity: 0.8
        } : {},
        opacity: interactiveMode && !isViable ? 0.4 : 1
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {selectedCount > 0 && (
          <Typography variant="body2" sx={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
            Selected: {selectedCount}
          </Typography>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, fontFeatureSettings: '"tnum"' }}>
          × {count}
        </Typography>
      </Box>
    </Box>
  )
}
