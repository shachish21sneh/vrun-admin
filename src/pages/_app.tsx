import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import NextTopLoader from "nextjs-toploader";

// redux
import { Provider } from "react-redux";
import { store, persistor } from "@/toolkit/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NextTopLoader showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
