import Metadata from "@/components/Metadata";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Metadata />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
