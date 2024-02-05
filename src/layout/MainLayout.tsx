import Header from "../components/Header";
import { ToastContainer } from 'react-toastify'

export default function MainLayout({ children }) {
  return (
    <div className="container">
      <Header />
      {children}
      <ToastContainer type="error" position="bottom-right" />
    </div>
  );
}
