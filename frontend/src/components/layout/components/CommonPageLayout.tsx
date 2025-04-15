import { Box, Sheet } from "@mui/joy";
import { ReactNode } from "react";

interface CommonPageLayoutProps {
  children: ReactNode;
}

const CommonPageLayout = ({ children }: CommonPageLayoutProps) => {
  return (
    <Sheet
      variant="outlined"
      color="neutral"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        borderRadius: 'var(--joy-radius-md)',
        boxShadow: 'var(--joy-shadow-md)',
        width: '100%',
        height: 'auto',
        maxHeight: '100vh',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--joy-radius-md)',
          overflow: 'visible',
          gap: 2,
          border: '1px solid var(--theme-divider)',
          boxShadow: 'var(--joy-shadow-md)',
          paddingBottom: '16px',
        }}
      >
        {children}
      </Box>
    </Sheet>
  );
};

export default CommonPageLayout;