import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Registro central de elementos (carregamento dinâmico via import.meta.glob)
import './libs/elementRegistry.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
