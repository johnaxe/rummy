import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppProvider } from "context/appContext";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "styles/theme.js";

import "styles/theme.scss";

export default function MyApp({ Component, pageProps }) {
    const Layout = Component.Layout ? Component.Layout : React.Fragment;

    return (
        <ThemeProvider theme={theme}>
            <AppProvider>
                <CssBaseline />
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AppProvider>
        </ThemeProvider>
    );
}
