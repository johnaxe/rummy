import Head from "next/head";
import { AppBar, Box, Toolbar, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import TableViewIcon from "@mui/icons-material/TableView";
import Menu from "@/components/Menu";
import New from "@/components/New";
import ConfirmNewGame from "@/components/ConfirmNewGame";
import { AppContext } from "context/appContext";
export default function Layout({ children }) {
    const { currentGame } = useContext(AppContext);
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
                        <Link href="/">
                            <Typography
                                title="Gå till spelomgång"
                                variant="h6"
                                color="inherit"
                                component="div"
                                sx={{ cursor: "pointer" }}>
                                RUMMY
                            </Typography>
                        </Link>
                        {currentGame.id && (
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{ marginLeft: "auto", cursor: "pointer" }}>
                                <Link href="/">
                                    <Tooltip title="Aktiv spelomgång">
                                        <TableViewIcon />
                                    </Tooltip>
                                </Link>
                            </Box>
                        )}
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
