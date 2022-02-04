import Head from "next/head";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Menu from "@/components/Menu";
import New from "@/components/New";
import ConfirmNewGame from "@/components/ConfirmNewGame";
export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                />
                <title>Rummy</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Menu />
                        <Typography
                            variant="h6"
                            color="inherit"
                            component="div">
                            Rummy scoreboard
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            {children}
            <New />
            <ConfirmNewGame />
            <footer></footer>
        </>
    );
}
