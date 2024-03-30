import NavBar from "@/components/navigation/NavBar";
import Toast from "@/components/ui/Toast";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import WalletProvider from "@/providers/WalletProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletProvider session={pageProps.session}>
        <ThemeProvider>
          <NavBar>
            <Component {...pageProps} />
          </NavBar>
        </ThemeProvider>
      </WalletProvider>
      <Toast />
    </>
  );
}
