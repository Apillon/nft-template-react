import Header from '../components/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function MainLayout({ children }: { children: any }) {
  return (
    <div className="container">
      <Header />
      {children}
      <ToastContainer type="error" position="bottom-right" />
    </div>
  )
}
