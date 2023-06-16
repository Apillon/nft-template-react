import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MainLayout from "../layout/mainLayout";

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
      <ToastContainer type="error" position="bottom-right" />
    </MainLayout>
  );
}

export default MyApp;
