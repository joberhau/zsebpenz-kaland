import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import KretaTest from './components/KretaTest.tsx'

const root = window.location.hash === '#kreta-test' ? <KretaTest /> : <App />

createRoot(document.getElementById('root')!).render(<StrictMode>{root}</StrictMode>)
