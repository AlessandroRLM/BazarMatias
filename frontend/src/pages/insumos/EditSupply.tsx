import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,
    Stack
  } from "@mui/joy";
  import Information from "../../components/core/Information/Information";
  
  export default function EditarInsumo() {
    return (
      <Information
        title="Editar Insumo"
        sectionTitle="Información del Insumo"
        footerContent={
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              color="neutral"
              onClick={() => window.history.back()}
              fullWidth
            >
              Cancelar
            </Button>
            <Button 
              variant="solid" 
              color="primary"
              fullWidth
            >
              Confirmar
            </Button>
          </Stack>
        }
      >
        <Stack spacing={3}>
          {/* Nombre del insumo */}
          <FormControl>
            <FormLabel>Nombre del Insumo</FormLabel>
            <Input 
              placeholder="Ej: Papel A4, Tóner negro, etc." 
              fullWidth
            />
          </FormControl>
  
          {/* Stock */}
          <FormControl>
            <FormLabel>Stock</FormLabel>
            <Input 
              placeholder="Cantidad disponible" 
              type="number"
              fullWidth
            />
          </FormControl>
  
          {/* Categoría */}
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Select 
              defaultValue="" 
              placeholder="Selecciona una categoría"
              fullWidth
            >
              <Option value="papeleria">Papelería</Option>
              <Option value="oficina">Oficina</Option>
              <Option value="limpieza">Limpieza</Option>
              <Option value="electronica">Electrónica</Option>
              <Option value="otros">Otros</Option>
            </Select>
          </FormControl>
        </Stack>
      </Information>
    );
  }