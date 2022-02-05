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
                        padding: "8px 0px",
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    legend: {
                        "& span": {
                            padding: "0px 1px 0px 0px;",
                        },
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "0.7rem",
                    left: "-3px",
                    top: "3px",
                },
            },
        },
    },
});

export default theme;
