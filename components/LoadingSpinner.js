import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

const LoadingSpinner = ({ visible }) => {
    const theme = useTheme();
    return (
        <Backdrop
            style={{
                zIndex: theme.zIndex.drawer + 1,
                color: theme.palette.background.default,
            }}
            open={visible}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingSpinner;
