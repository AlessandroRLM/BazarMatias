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

  export default function EditarProvedor() {
    return (
      <Information
        title="Añadir Proveedor"
        sectionTitle="Informacion del Proveedor"
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
        {/* Nombre del proveedor */}
        <FormControl>
          <FormLabel>Nombre del Proveedor</FormLabel>
          <Input placeholder="Añadir Nombre del proveedor" />
        </FormControl>
  
        {/* Precio y stock */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Dirección</FormLabel>
            <Input placeholder="Añadir Dirección" />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Teléfono</FormLabel>
            <Input placeholder="Añadir Teléfono" />
          </FormControl>
        </Stack>

        {/* Precio y stock */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Correo</FormLabel>
            <Input placeholder="Añadir Correo" />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Rut</FormLabel>
            <Input placeholder="Añadir Rut" />
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
  