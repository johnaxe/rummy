import React, { useContext } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from "@mui/material";
import { AppContext } from "context/appContext";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmNewGame() {
    const { showConfirm, setShowConfirm, initGame } = useContext(AppContext);

    const handleClose = (createNew) => {
        setShowConfirm(false);
        if (createNew) {
            initGame();
        }
    };

    return (
        <Dialog
            open={showConfirm}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle></DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Det finns redan ett påbörjat spel. Vill du fortsätta?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleClose(false);
                    }}>
                    Avbryt
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleClose(true);
                    }}>
                    Fortsätt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
