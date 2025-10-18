import { createContext } from "react";
import { userProfileFormContextType } from "../../types/administration.types";

const UserProfileFormContext = createContext<userProfileFormContextType | null>(null)

export default UserProfileFormContext