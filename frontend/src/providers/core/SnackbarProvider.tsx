import { useState } from "react";
import { SnackbarProviderProps, SnackbarState } from "../../types/core.types";
import { SnackbarContext } from "../../contexts/core/SnackbarContext";
import { Box, ColorPaletteProp, IconButton, Snackbar } from "@mui/joy";
import { CheckCircle, CloseRounded, ErrorRounded } from "@mui/icons-material";

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        color: 'neutral',
    });

    const showSnackbar = (message: string, color: ColorPaletteProp = 'neutral') => {
        setSnackbar({ open: true, message, color });
    };

    const hideSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                variant="soft"
                color={snackbar.color}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                onClose={hideSnackbar}
                startDecorator={
                    snackbar.color === 'success' ? <CheckCircle /> : <ErrorRounded />
                }
                endDecorator={
                    <IconButton onClick={hideSnackbar} variant="plain" size="sm" color={snackbar.color}>
                        <CloseRounded />
                    </IconButton>
                }
            >
                <Box sx={{ flexGrow: 1 }}>{snackbar.message}</Box>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};