import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './context/AuthContext';
import { SystemProvider } from './context/SystemContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SystemProvider>
  </StrictMode>,
)
