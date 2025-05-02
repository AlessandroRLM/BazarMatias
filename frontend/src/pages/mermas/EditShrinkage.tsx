import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,
    Stack,
    Textarea
  } from "@mui/joy";
  import Information from "../../components/core/Information/Information";

  export default function EditarMerma() {
    return (
      <Information
        title="Editar Merma"
        sectionTitle="Detalles de la Merma"
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
        <Stack spacing={1}>
          <FormControl>
            <FormLabel>Nombre del Producto</FormLabel>
            <Input 
              placeholder="Añadir Nombre del producto"
              fullWidth
            >
            </Input>
          </FormControl>
  
          {/* Cantidad */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Precio (CLP$)</FormLabel>
              <Input 
                type="number" 
                placeholder="Añadir precio"
                fullWidth
                required
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Cantidad</FormLabel>
              <Input 
                type="number"
                placeholder="Añadir cantidad"
                fullWidth
              >
              </Input>
            </FormControl>
          </Stack>
  
        <FormControl sx={{ flex: 1 }}>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Categoría</FormLabel>
              <Select 
                placeholder="Seleccione una categoria"
                fullWidth
                required
              >
                <Option value="daño">Daño físico</Option>
                <Option value="deterioro">Deterioro</Option>
                <Option value="otros">Otros</Option>
              </Select>
            </FormControl>
          
  
          <FormControl>
            <FormLabel>Obervacion</FormLabel>
            <Textarea 
              placeholder="Registrar Observaciones"
              minRows={2}
              maxRows={4}
            />
          </FormControl>
        </Stack>
      </Information>
    );
  }