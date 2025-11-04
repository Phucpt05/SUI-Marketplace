import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GlobalSuiProvider } from './components/providers/GlobalSuiProvider.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalSuiProvider>
        <App />
      </GlobalSuiProvider>
    </BrowserRouter>
  </StrictMode>,
)
