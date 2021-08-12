import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { CssBaseline } from '@material-ui/core';

function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (

    <React.Fragment>
      <CssBaseline />

      <Component {...pageProps} />
    </React.Fragment>
  )
}
export default MyApp
