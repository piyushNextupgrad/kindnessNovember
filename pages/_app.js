import Head from "next/head";
import { Provider } from "react-redux";
import store from "@/store";
import "@/styles/globals.css";
import "@/styles/eventpages.css";
import "@/styles/Home.module.css";
import "@/styles/admin.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { useEffect, useState } from "react";

let persistor = persistStore(store);

export default function MyApp({ Component, pageProps }) {
  const [data, setData] = useState("");

  useEffect(() => {
    const newsData = localStorage.getItem("N-d");
    if (newsData) {
      setData(newsData);
      localStorage.removeItem("N-d");
    }
  });
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Kindness Campaign</title>
        <meta name="description" content='Kindness Campaign' />

        {/* <meta property="og:image:alt" content="About Acme" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" /> */}


      </Head>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}
