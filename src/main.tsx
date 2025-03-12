
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAuthProvider>
        <App />
        <Toaster position="top-right" richColors />
      </FirebaseAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
