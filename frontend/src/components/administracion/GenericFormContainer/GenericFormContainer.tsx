import { Box, Avatar } from "@mui/joy";
import { ReactNode } from "react";

interface GenericFormContainerProps {
  children: ReactNode;
  avatarText?: string;
}

const GenericFormContainer = ({ children, avatarText = "AA" }: GenericFormContainerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 0,
      }}
    >
      <Avatar variant="soft" color="primary" size="profile">
        {avatarText}
      </Avatar>
      {children}
    </Box>
  );
};

export default GenericFormContainer;