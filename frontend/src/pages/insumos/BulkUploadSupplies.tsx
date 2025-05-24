import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Card,
  CardOverflow,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/joy";
import { CloudUpload, Delete, FileDownload } from "@mui/icons-material";
import {
  uploadSupplyExcel,
  downloadSupplyTemplate,
} from "../../services/inventoryService";

const BulkUploadSupplies: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState<"success" | "danger">("success");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedFile(e.target.files?.[0] || null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedFile(e.dataTransfer.files?.[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await uploadSupplyExcel(formData);
      setSnackbarMessage("Insumos cargados exitosamente.");
      setSnackbarColor("success");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setSnackbarMessage("Error al subir el archivo. Verifica el formato o los datos.");
      setSnackbarColor("danger");
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await downloadSupplyTemplate();
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plantilla_insumos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar la plantilla:", error);
      setSnackbarMessage("No se pudo descargar la plantilla.");
      setSnackbarColor("danger");
      setSnackbarOpen(true);
    }
  };

  const cardOverflowStyle = {
    border: "2px dashed",
    borderColor: "neutral.300",
    borderRadius: "sm",
    p: { xs: 4, md: 6 },
    textAlign: "center",
    cursor: "pointer",
    maxHeight: "400px",
    width: "80%",
    maxWidth: "800px",
    mx: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "16/9",
    "&:hover": { borderColor: "primary.500" },
  };

  const fileInfoStyle = {
    border: "1px solid",
    borderColor: "neutral.200",
    borderRadius: "sm",
    p: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 500,
    mx: "auto",
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Carga Masiva de Insumos
      </Typography>

      <Card variant="outlined" sx={{ maxWidth: "100%", mx: "auto", p: 3, borderRadius: "sm" }}>
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography level="h2" sx={{ mb: 1 }}>
            Subir Archivo
          </Typography>
          <Typography level="body-sm">
            Arrastra y suelta tu archivo Excel para cargar múltiples insumos
          </Typography>
        </Box>

        {!selectedFile ? (
          <CardOverflow onDrop={handleDrop} onDragOver={handleDragOver} sx={cardOverflowStyle}>
            <CloudUpload sx={{ fontSize: { xs: 40, md: 100 }, color: "neutral.500", mb: 2 }} />

            <Typography level="body-md" sx={{ mb: 1 }}>
              Arrastra y suelta tu archivo aquí
            </Typography>

            <Typography level="body-sm" sx={{ mb: 2 }}>
              o
            </Typography>

            <Button component="label" variant="outlined" size="sm" sx={{ mb: 1 }}>
              Seleccionar Archivo
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileChange} />
            </Button>

            <Typography level="body-xs" sx={{ mt: 1 }}>
              Formatos soportados: .xlsx, .xls
            </Typography>
          </CardOverflow>
        ) : (
          <Box sx={fileInfoStyle}>
            <Box>
              <Typography level="body-md" fontWeight="lg">
                {selectedFile.name}
              </Typography>
              <Typography level="body-sm">{`${selectedFile.size.toLocaleString()} bytes`}</Typography>
            </Box>
            <IconButton variant="plain" color="danger" onClick={() => setSelectedFile(null)}>
              <Delete />
            </IconButton>
          </Box>
        )}

        <Stack direction="column" alignItems="center" sx={{ my: 3 }}>
          <Typography level="body-sm" sx={{ mb: 1 }}>
            ¿Primera vez?
          </Typography>
          <Button
            variant="plain"
            size="sm"
            startDecorator={<FileDownload />}
            sx={{ "--Button-gap": "0.3rem" }}
            onClick={handleDownloadTemplate}
          >
            Descarga nuestra plantilla
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" color="neutral" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button disabled={!selectedFile || loading} onClick={handleUpload}>
            {loading ? <CircularProgress size="sm" /> : "Confirmar"}
          </Button>
        </Stack>
      </Card>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert color={snackbarColor} variant="soft">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUploadSupplies;