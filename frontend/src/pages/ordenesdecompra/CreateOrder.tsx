import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,
    Stack,
    Typography,
    Grid
  } from "@mui/joy";
  
  export default function CreateOrder() {
    return (
      <Box sx={{ p: 3 }}>
        <Typography level="h2" sx={{ mb: 3 }}>Crear Orden de Trabajo</Typography>

        <Box sx={{ 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 'sm',
          p: 3,
          mb: 3
        }}>
          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Seleccionar Trabajador</FormLabel>
            <Select placeholder="Busque y seleccione un trabajador">
              <Option value="1">Juan Pérez (RUT: 12.345.678-9 - Cargo: Técnico)</Option>
              <Option value="2">María García (RUT: 23.456.789-0 - Cargo: Supervisora)</Option>
              <Option value="3">Carlos López (RUT: 34.567.890-1 - Cargo: Operario)</Option>
            </Select>
          </FormControl>
  
          <Box sx={{ 
            mb: 3, 
            p: 3, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 'sm' 
          }}>
            <Typography level="h4" sx={{ mb: 2 }}>Información del Trabajador</Typography>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input placeholder="Nombre completo" fullWidth />
              </FormControl>
              <FormControl>
                <FormLabel>RUT</FormLabel>
                <Input placeholder="Ej: 12.345.678-9" fullWidth />
              </FormControl>
              <FormControl>
                <FormLabel>Cargo</FormLabel>
                <Input placeholder="Cargo del trabajador" fullWidth />
              </FormControl>
            </Stack>
          </Box>

          <Typography level="h4" sx={{ mb: 2 }}>Información del Trabajo</Typography>
  
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                height: '100%', 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 'sm' 
              }}>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Tipo de tarea</FormLabel>
                    <Select placeholder="Seleccione tipo de tarea">
                      <Option value="mantenimiento">Mantenimiento</Option>
                      <Option value="reparacion">Reparación</Option>
                      <Option value="instalacion">Instalación</Option>
                      <Option value="otro">Otro</Option>
                    </Select>
                  </FormControl>
  
                  <FormControl>
                    <FormLabel>Detalle</FormLabel>
                    <Input 
                      placeholder="Descripción detallada del trabajo" 
                      multiline 
                      minRows={3} 
                      fullWidth 
                    />
                  </FormControl>
  
                  <FormControl>
                    <FormLabel>Prioridad</FormLabel>
                    <Select placeholder="Seleccione prioridad">
                      <Option value="alta">Alta</Option>
                      <Option value="media">Media</Option>
                      <Option value="baja">Baja</Option>
                    </Select>
                  </FormControl>
  
                  <FormControl>
                    <FormLabel>Plazo</FormLabel>
                    <Input type="date" fullWidth />
                  </FormControl>
                </Stack>
              </Box>
            </Grid>
  
            <Grid xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                height: '100%', 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 'sm' 
              }}>
                <Typography level="h4" sx={{ mb: 2 }}>Orden de Trabajo</Typography>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Fecha de emisión</FormLabel>
                    <Input 
                      type="date" 
                      fullWidth 
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
  
                  <FormControl>
                    <FormLabel>Número de orden</FormLabel>
                    <Input 
                      placeholder="Generado automáticamente" 
                      fullWidth 
                      disabled
                    />
                  </FormControl>
                </Stack>
              </Box>
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
            Confirmar
          </Button>
        </Box>
      </Box>
    );
  }