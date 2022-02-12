import Head from "next/head";
import {
    AppBar,
    Box,
    Toolbar,
    Tooltip,
    Typography,
    Button,
} from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import TableViewIcon from "@mui/icons-material/TableView";
import RefreshIcon from "@mui/icons-material/Refresh";
import Menu from "@/components/Menu";
import New from "@/components/New";
import ConfirmNewGame from "@/components/ConfirmNewGame";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AppContext } from "context/appContext";
import useRouterStatus from "hooks/useRouterStatus";
export default function Layout({ children }) {
    const { currentGame, showSpinner } = useContext(AppContext);
    const { isLoading } = useRouterStatus();
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                />
                <title>Rummy</title>
            </Head>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar variant="dense">
                        <Menu />
                        <Link href="/">
                            <Typography
                                title="Gå till start"
                                variant="h6"
                                color="inherit"
                                component="div"
                                sx={{ cursor: "pointer" }}>
                                RUMMY
                            </Typography>
                        </Link>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ marginLeft: "auto", cursor: "pointer" }}>
                            <Button
                                size="small"
                                sx={{ color: "#fff" }}
                                variant="contained"
                                onClick={() => {
                                    location.reload();
                                }}
                                title="Uppdatera sidan">
                                <Tooltip title="Uppdatera sidan">
                                    <RefreshIcon />
                                </Tooltip>
                            </Button>

                            {currentGame.id && (
                                <Link href="/">
                                    <Button
                                        size="small"
                                        sx={{ color: "#fff", ml: 2 }}
                                        variant="contained">
                                        <Tooltip title="Aktiv spelomgång">
                                            <TableViewIcon />
                                        </Tooltip>
                                    </Button>
                                </Link>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ mt: 6 }}>{children}</Box>
            <New />
            <ConfirmNewGame />
            <LoadingSpinner visible={isLoading || showSpinner} />

            <footer></footer>
        </>
    );
}
