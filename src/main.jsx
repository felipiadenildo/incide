import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🔥 IMPORTS AUTOMÁTICOS - registra TODOS os elementos
import './libs/tikz';
import './libs/circuittikz';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
