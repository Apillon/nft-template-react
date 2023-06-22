import './styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import Main from './components/Main'

const App = () => {
  return (
    <div className="container">
      <Header />
      <Main />
      <ToastContainer type="error" position="bottom-right" />
    </div>
  )
}

export default App
