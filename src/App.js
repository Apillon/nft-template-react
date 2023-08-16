import './styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import Modal from 'react-modal'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import Main from './components/Main'

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

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
