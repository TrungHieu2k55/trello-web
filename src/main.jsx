import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'

// Cấu hình Mui Dialog
import { ConfirmProvider } from 'material-ui-confirm'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfirmProvider defaultOptions={{ 
        allowClose: false,
        dialogProps: { maxWidth : 'xs' },
        cancellationButtonProps: { color: 'inherit' },
        confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
        buttonOrder: ['confirm', 'cancel']
      }}>
        <CssBaseline />
        <App />
        <ToastContainer theme='colored' />
      </ConfirmProvider>
    </ThemeProvider>
  </React.StrictMode>
)
