import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    spacing: 8,
    typography: {
        body1: {
            fontSize: ".9rem",
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    input: {
                        padding: "5px 0px",
                    },
                },
            },
        },
    },
});

export default theme;
