import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.jsx'

// Import Bootstrap FIRST
import 'bootstrap/dist/css/bootstrap.min.css'

// Then import your custom CSS
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)