import { Box, Button } from '@mui/material'

const BUTTON_LAYOUT = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['Clear', '0', '.'],
  ['Enter']
]

export default function NumberPad({ onInput, onClear, onEnter }) {
  const handleClick = (value) => {
    if (value === 'Clear') {
      onClear?.()
    } else if (value === 'Enter') {
      onEnter?.()
    } else {
      onInput?.(value)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 2
      }}
    >
      {BUTTON_LAYOUT.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: 'flex',
            gap: 1.5,
            justifyContent: 'stretch'
          }}
        >
          {row.map((value) => (
            <Button
              key={value}
              onClick={() => handleClick(value)}
              variant={value === 'Enter' ? 'contained' : 'outlined'}
              color={value === 'Clear' ? 'secondary' : 'primary'}
              sx={{
                flex: value === 'Enter' ? 1 : '1 1 0',
                minHeight: 64,
                fontSize: '1.25rem',
                fontWeight: 600
              }}
            >
              {value}
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  )
}
