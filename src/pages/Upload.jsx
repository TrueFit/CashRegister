import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import FileUpload from '../components/FileUpload'

export default function Upload() {
  const { currency, denominationSettings, setGlobalProgress } = useOutletContext()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
      <Box sx={{ maxWidth: 1280, width: '100%' }}>
        <FileUpload
          currency={currency}
          denominationSettings={denominationSettings}
          setGlobalProgress={setGlobalProgress}
        />
      </Box>
    </Box>
  )
}
