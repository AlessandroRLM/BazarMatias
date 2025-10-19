import { useContext } from "react";
import { SnackbarContext } from "../../contexts/core/SnackbarContext";

export const useSnackbar = () => useContext(SnackbarContext)
