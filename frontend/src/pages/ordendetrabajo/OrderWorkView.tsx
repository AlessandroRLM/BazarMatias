import {
    Box,
    Typography,
    Stack,
    Grid,
    Button
  } from "@mui/joy";
  
  interface OrderData {
    worker: {
      name: string;
      rut: string;
      position: string;
    };
    job: {
      taskType: string;
      details: string;
      priority: string;
      deadline: string;
    };
    order: {
      issueDate: string;
      orderNumber: string;
    };
  }
  
  export default function OrderView() {
    // Datos de ejemplo
    const orderData = {
      worker: {
        name: "Juan Pérez",
        rut: "12.345.678-9",
        position: "Técnico"
      },
      job: {
        taskType: "Mantenimiento",
        details: "Revisión periódica de equipos de climatización en todas las áreas comunes",
        priority: "Media",
        deadline: "15/12/2023"
      },
      order: {
        issueDate: "20/11/2023",
        orderNumber: "ORD-2023-001"
      }
    };
  
    return (
      <Box sx={{ p: 3 }}>
        <Typography level="h2" sx={{ mb: 3 }}>Orden de Trabajo</Typography>
        
        <Box sx={{ 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 'sm',
          p: 3,
          mb: 3
        }}>
          <Box sx={{ 
            mb: 3, 
            p: 3, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 'sm' 
          }}>
            <Typography level="h4" sx={{ mb: 3 }}>Información del Trabajador</Typography>
            <Stack spacing={2}>
              <div>
                <Typography level="body-sm" fontWeight="lg">Nombre</Typography>
                <Typography>{orderData.worker.name}</Typography>
              </div>
              <div>
                <Typography level="body-sm" fontWeight="lg">RUT</Typography>
                <Typography>{orderData.worker.rut}</Typography>
              </div>
              <div>
                <Typography level="body-sm" fontWeight="lg">Cargo</Typography>
                <Typography>{orderData.worker.position}</Typography>
              </div>
            </Stack>
          </Box>
  
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Box sx={{ 
                p: 3, 
                height: '100%', 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 'sm' 
              }}>
                <Typography level="h4" sx={{ mb: 3 }}>Información del Trabajo</Typography>
                <Stack spacing={3}>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Tipo de tarea</Typography>
                    <Typography>{orderData.job.taskType}</Typography>
                  </div>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Detalle</Typography>
                    <Typography>{orderData.job.details}</Typography>
                  </div>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Prioridad</Typography>
                    <Typography>{orderData.job.priority}</Typography>
                  </div>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Plazo</Typography>
                    <Typography>{orderData.job.deadline}</Typography>
                  </div>
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
                <Typography level="h4" sx={{ mb: 3 }}>Orden de Trabajo</Typography>
                <Stack spacing={3}>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Fecha de emisión</Typography>
                    <Typography>{orderData.order.issueDate}</Typography>
                  </div>
                  <div>
                    <Typography level="body-sm" fontWeight="lg">Número de orden</Typography>
                    <Typography>{orderData.order.orderNumber}</Typography>
                  </div>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
  
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="solid" 
            color="primary"
            onClick={() => window.history.back()}
            sx={{ width: 150 }}
          >
            Volver
          </Button>
        </Box>
      </Box>
    );
  }