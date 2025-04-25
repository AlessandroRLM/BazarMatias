import { Box, Typography, Divider, Stack } from "@mui/joy";

interface FormContainerProps {
  title: string;
  sectionTitle?: string; 
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function Information({ title,sectionTitle = "" , children, footerContent }: FormContainerProps) {
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

      <Typography level="h4">{sectionTitle}</Typography>
      
      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>{children}</Stack>

      {footerContent && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>{footerContent}</Box>
        </>
      )}
    </Box>
  );
}
