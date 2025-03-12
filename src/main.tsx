
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from '@/components/ui/sonner'
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAuthProvider>
      <App />
      <Toaster position="top-right" richColors />
    </FirebaseAuthProvider>
  </React.StrictMode>,
)
