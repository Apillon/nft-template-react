import Main from './components/Main'
import Web3ContextProvider from './context/Web3Context'

function App() {
  return (
    <Web3ContextProvider>
      <Main />
    </Web3ContextProvider>
  )
}

export default App
