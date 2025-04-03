import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Puzzle from './puzzle/puzzle'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Puzzle />
  </StrictMode>,
)
