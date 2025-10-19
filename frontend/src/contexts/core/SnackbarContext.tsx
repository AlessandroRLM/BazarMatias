import { createContext } from "react";
import { SnackbarContextType } from "../../types/core.types";

export const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});
