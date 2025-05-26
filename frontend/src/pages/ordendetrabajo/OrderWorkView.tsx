import {
    Box,
    Typography,
    Stack,
    Grid,
    Button
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { fetchWorkOrder } from "../../services/salesService";
import { WorkOrder } from "../../types/sales.types";

export default function OrderView() {
    const { id } = useParams({ from: '/_auth/ventas/ordenesdetrabajo/ver-orden-trabajo/$id' });
    const [orderData, setOrderData] = useState<WorkOrder | null>(null);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const order = await fetchWorkOrder(id!);
                setOrderData(order);
            } catch (error) {
                console.error("Error loading work order:", error);
            }
        };
        loadOrder();
    }, [id]);

    if (!orderData) return <div>Cargando...</div>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography level="h2" sx={{ mb: 3 }}>Orden de Trabajo #{orderData.numero_orden}</Typography>
            
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
                            <Typography>{orderData.trabajador_nombre}</Typography>
                        </div>
                        <div>
                            <Typography level="body-sm" fontWeight="lg">RUT</Typography>
                            <Typography>{orderData.trabajador_rut}</Typography>
                        </div>
                        <div>
                            <Typography level="body-sm" fontWeight="lg">Cargo</Typography>
                            <Typography>{orderData.trabajador_cargo}</Typography>
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
                                    <Typography>{orderData.tipo_tarea}</Typography>
                                </div>
                                <div>
                                    <Typography level="body-sm" fontWeight="lg">Detalle</Typography>
                                    <Typography>{orderData.descripcion}</Typography>
                                </div>
                                <div>
                                    <Typography level="body-sm" fontWeight="lg">Prioridad</Typography>
                                    <Typography>
                                        {orderData.prioridad === 'alta' ? 'Alta' : 
                                         orderData.prioridad === 'media' ? 'Media' : 'Baja'}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography level="body-sm" fontWeight="lg">Plazo</Typography>
                                    <Typography>{new Date(orderData.plazo).toLocaleDateString()}</Typography>
                                </div>
                                <div>
                                    <Typography level="body-sm" fontWeight="lg">Estado</Typography>
                                    <Typography>
                                        {orderData.status === 'pendiente' ? 'Pendiente' : 
                                         orderData.status === 'en_proceso' ? 'En Proceso' : 
                                         orderData.status === 'completada' ? 'Completada' : 'Cancelada'}
                                    </Typography>
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
                                    <Typography>{new Date(orderData.created_at).toLocaleDateString()}</Typography>
                                </div>
                                <div>
                                    <Typography level="body-sm" fontWeight="lg">Número de orden</Typography>
                                    <Typography>{orderData.numero_orden}</Typography>
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