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

  export default function AñadirProducto() {
    return (
      <Information
        title="Añadir Producto"
        footerContent={
          <>
            <Button 
            variant="outlined" 
            color="neutral"
            onClick={() => window.history.back()}
            >
            Cancelar
            </Button>
            <Button variant="solid" color="primary">
              Añadir
            </Button>
          </>
        }
      >
        {/* Nombre del producto */}
        <FormControl>
          <FormLabel>Nombre del Producto</FormLabel>
          <Input placeholder="Añadir Nombre del producto" />
        </FormControl>
  
        {/* Precio y stock */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Precio (CLP$)</FormLabel>
            <Input placeholder="Añadir Precio" />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Stock</FormLabel>
            <Input placeholder="Añadir Cantidad" />
          </FormControl>
        </Stack>
  
        {/* Categoría */}
        <FormControl>
          <FormLabel>Categoría</FormLabel>
          <Select defaultValue="" placeholder="Selecciona una categoría">
            <Option value="utiles">Útiles escolares</Option>
            <Option value="oficina">Oficina</Option>
            <Option value="otros">Otros</Option>
          </Select>
        </FormControl>
      </Information>
    );
  }
  