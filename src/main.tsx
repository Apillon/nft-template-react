import { Buffer } from 'buffer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import MainLayout from './layout/MainLayout'

import './index.css'
import 'react-tooltip/dist/react-tooltip.css'

globalThis.Buffer = Buffer

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainLayout>
      <App />
    </MainLayout>
  </StrictMode>
)
