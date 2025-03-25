import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TaskProvider } from './providers/TaskProvider'
import { ThemeProvider } from './providers/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light'>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ThemeProvider>
  </StrictMode>
)
