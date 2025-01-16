import "@/styles/globals.css";
import "@/styles/spinner-loading.scss"
import "@/styles/manage-style.scss"
import "../../components/auth/auth-style.scss";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "@store/index";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

let persistor = persistStore(store);
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#01a0e9",
          borderRadius: 2,
          // Alias Token
          // colorBgContainer: "#f6ffed",
        },
      }}
    >
      <SessionProvider session={session}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-container"
        />
        {/* Same as */}
        <Provider store={store}>
          {/* <PersistGate persistor={persistor} loading={null}> */}
          <div className={inter.className}>
            <Component {...pageProps} />
          </div>
          {/* </PersistGate> */}
        </Provider>
      </SessionProvider>
    </ConfigProvider>
  );
}
