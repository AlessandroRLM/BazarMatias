import { Box, Typography, Divider, Stack } from "@mui/joy";

interface FormContainerProps {
  title: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function Information({ title, children, footerContent }: FormContainerProps) {
  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        p: 3,
        bgcolor: "background.surface",
        borderRadius: "md",
        boxShadow: "sm",
      }}
    >
      <Typography level="h2" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Typography level="h4">Información del producto</Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>{children}</Stack>

      {footerContent && (
        <>
  
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>{footerContent}</Box>
        </>
      )}
    </Box>
  );
}
