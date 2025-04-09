import { createContext } from "react";
import { userProfileFormContextType } from "../../types/administracion.types";

const UserProfileFormContext = createContext<userProfileFormContextType | null>(null)

export default UserProfileFormContext