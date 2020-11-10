import React, {ComponentProps, ComponentType} from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import {Provider} from "react-redux";
import {fetchValidatedUser} from "@/store/slices/authSlice"
import store from "@/store";
import theme from '@/styles/theme';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import Navbar from '@/components/Layout/Navbar';

// The component props constraint
interface Props {
  Component: ComponentType
  Props: ComponentProps<any>
}

/**
 * The App component.
 *
 * @param Component
 * @param Props
 * @constructor
 */
export default function MyApp({ Component, Props }: Props)
{
  // The initial user validation
  // TODO: This should be called on server with getServerSideProps ?
  store.dispatch(fetchValidatedUser())

  // Render
  return (
    <Provider store={store}>
      <>

        {/* The Header */}
        <Head>
          {/* TODO: This should be declared in env */}
          <title>Mail</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        {/* The Body */}
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Application Navbar */}
          <Navbar/>

          {/* Component Entrypoint */}
          <Component {...Props} />

        </ThemeProvider>

      </>
    </Provider>
  );
}
