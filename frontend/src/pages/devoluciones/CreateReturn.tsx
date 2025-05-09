import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Typography,
  Grid
} from "@mui/joy";

export default function ReturnCreate() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Añadir</Typography>

      <Box sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 'sm',
        p: 3,
        mb: 3
      }}>
        <Typography level="h4" sx={{ mb: 3 }}>Información del Producto</Typography>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Nombre del Proveedor</FormLabel>
          <Input placeholder="Ingrese nombre del proveedor" fullWidth />
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Nombre del Producto</FormLabel>
          <Input placeholder="Ingrese nombre del producto" fullWidth />
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Cantidad</FormLabel>
              <Input type="number" placeholder="0" />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Estado del Producto</FormLabel>
              <Select placeholder="Seleccione estado">
                <Option value="nuevo">Nuevo</Option>
                <Option value="usado">Usado</Option>
                <Option value="defectuoso">Defectuoso</Option>
                <Option value="dañado">Dañado</Option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Motivo</FormLabel>
              <Input 
                placeholder="Describa el motivo de la devolución" 
                multiline 
                minRows={3} 
              />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Fecha de Devolución</FormLabel>
              <Input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Número de Compra</FormLabel>
              <Input placeholder="Ingrese número de compra" />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Fecha de Compra</FormLabel>
              <Input type="date" />
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          color="neutral"
          onClick={() => window.history.back()}
          sx={{ width: 150 }}
        >
          Cancelar
        </Button>
        <Button 
          variant="solid" 
          color="primary"
          sx={{ width: 150 }}
        >
          Añadir Devolución
        </Button>
      </Box>
    </Box>
  );
}