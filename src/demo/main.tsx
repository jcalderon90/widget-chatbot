import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DemoPage } from './DemoPage'
import './demo.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>,
)
