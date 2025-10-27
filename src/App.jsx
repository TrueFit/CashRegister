import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Till from './pages/Till.jsx'
import Upload from './pages/Upload.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import { getInitialDrawerState } from './utils/cashRegister'
import { getCurrencyConfig } from './utils/currencies'
import { calculateTillTotal, formatTillTotal } from './utils/tillCalculator'

function Layout() {
  const [currency, setCurrency] = useState('USD')
  const [denominationSettings, setDenominationSettings] = useState({
    use2DollarBill: false,
    use1DollarCoin: false
  })
  const [drawerState, setDrawerState] = useState(() =>
    getInitialDrawerState(currency, denominationSettings)
  )
  const tillTotal = calculateTillTotal(drawerState)
  const currencyConfig = getCurrencyConfig(currency)
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentTab = () => {
    if (location.pathname === '/till') return 'till'
    if (location.pathname === '/settings') return 'settings'
    return 'upload'
  }

  const currentTab = getCurrentTab()

  const [globalProgress, setGlobalProgress] = useState({ active: false, value: 0 })
  const showProgress = !!globalProgress?.active

  const handleTabChange = (event, newValue) => {
    if (newValue === 'upload') navigate('/')
    else if (newValue === 'till') navigate('/till')
    else if (newValue === 'settings') navigate('/settings')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" enableColorOnDark elevation={0}>
        <Container maxWidth={false} sx={{ maxWidth: 1280 }}>
          <Toolbar sx={{ px: 0, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PointOfSaleIcon sx={{ mr: 1.5 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                Creative Cash Draw Solutions
              </Typography>
            </Box>
            {currentTab === 'till' && (
              <Chip
                label={`Till: ${formatTillTotal(tillTotal, currencyConfig.symbol)}`}
                sx={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}
              />
            )}
            {currentTab !== 'till' && <Box sx={{ width: 120 }} />}
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          bgcolor: (theme) => theme.custom?.headerStripe || theme.palette.action.hover,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1280 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Upload" value="upload" />
            <Tab label="Till" value="till" />
            <Tab label="Settings" value="settings" />
          </Tabs>
        </Container>
      </Box>
      {showProgress && (
        <Box sx={{ width: '100%' }}>
          <Container maxWidth={false} sx={{ maxWidth: 1280 }}>
            <LinearProgress
              variant={Number.isFinite(globalProgress.value) ? 'determinate' : 'indeterminate'}
              value={Number.isFinite(globalProgress.value) ? globalProgress.value : undefined}
              sx={{ height: 3, borderRadius: 1 }}
            />
          </Container>
        </Box>
      )}
      <Container component="main" sx={{ py: 3, flexGrow: 1 }} maxWidth={false}>
        <Outlet context={{
          drawerState,
          setDrawerState,
          currency,
          setCurrency,
          denominationSettings,
          setDenominationSettings,
          setGlobalProgress
        }} />
      </Container>
    </Box>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Upload />} />
        <Route path="till" element={<Till />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
