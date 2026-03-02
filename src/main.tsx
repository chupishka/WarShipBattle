import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import "./reset.css"
import { BrowserRouter } from 'react-router'
import { PlayerProvider } from './context/player-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode >
    <BrowserRouter>
      <PlayerProvider>
        <App/>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
)
