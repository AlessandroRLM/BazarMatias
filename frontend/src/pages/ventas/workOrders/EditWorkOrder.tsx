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
    Grid,
    Snackbar
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { fetchWorkOrder, updateWorkOrder } from "../../../services/salesService";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderUpdatePayload } from "../../../types/sales.types";
import { getUsers } from "../../../services/userService";
import { User } from "../../../types/auth.types";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export default function EditWorkOrder() {
    const { id } = useParams({ from: '/_auth/ventas/ordenesdetrabajo/editar-orden-trabajo/$id' });
    const [workers, setWorkers] = useState<User[]>([]);
    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Snackbar states
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [users, order] = await Promise.all([
                    getUsers(),
                    fetchWorkOrder(id)
                ]);
                
                const workersArray = Array.isArray(users) ? users : [];
                setWorkers(workersArray);
                setWorkOrder(order);
                setErrorMessage(null);
            } catch (error) {
                console.error("Error loading data:", error);
                setErrorMessage("Error al cargar los datos");
                setOpenErrorSnackbar(true);
                setWorkers([]);
                setWorkOrder(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleInputChange = (field: keyof WorkOrder, value: string) => {
        if (workOrder) {
            setWorkOrder({
                ...workOrder,
                [field]: value
            });
        }
    };

    const handleWorkerChange = (value: string) => {
        const selected = workers.find(w => w.id === value);
        if (!selected || !workOrder) return;
        
        setWorkOrder({
            ...workOrder,
            trabajador: selected,
            trabajador_nombre: `${selected.first_name} ${selected.last_name}`,
            trabajador_rut: selected.formatted_national_id || '',
            trabajador_cargo: selected.position || ''
        });
    };

    const handleSubmit = async () => {
        if (!workOrder) return;

        const payload: WorkOrderUpdatePayload = {
            ...workOrder,
            trabajador: workOrder.trabajador.id, // Envía solo el ID
            // (opcional) Elimina campos read-only si el backend no los necesita:
            trabajador_nombre: undefined,
            trabajador_rut: undefined,
            trabajador_cargo: undefined,
        };

        try {
            await updateWorkOrder(workOrder.id, payload);
            setOpenSuccessSnackbar(true);
            setTimeout(() => {
            window.location.href = '/ventas/ordenesdetrabajo';
            }, 1500);
        } catch (error) {
            console.error("Error updating work order:", error);
            setErrorMessage("Error al actualizar la orden de trabajo");
            setOpenErrorSnackbar(true);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!workOrder) return <div>No se encontró la orden de trabajo</div>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography level="h2" sx={{ mb: 3 }}>Editar Orden de Trabajo</Typography>

            <Box sx={{ 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 'sm',
                p: 3,
                mb: 3
            }}>
                <FormControl sx={{ mb: 3 }}>
                    <FormLabel>Seleccionar Trabajador</FormLabel>
                    <Select 
                        placeholder="Busque y seleccione un trabajador"
                        value={workOrder.trabajador?.id || ''}
                        onChange={(_, value) => handleWorkerChange(value as string)}
                    >
                        {workers.map(worker => (
                            <Option key={worker.id} value={worker.id}>
                                {`${worker.first_name} ${worker.last_name} (RUT: ${worker.national_id} - Cargo: ${worker.position || 'Sin cargo'})`}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                {workOrder.trabajador && (
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
                                <Input 
                                    value={workOrder.trabajador_nombre || ''} 
                                    fullWidth 
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>RUT</FormLabel>
                                <Input 
                                    value={workOrder.trabajador_rut || ''} 
                                    fullWidth 
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Cargo</FormLabel>
                                <Input 
                                    value={workOrder.trabajador_cargo || ''} 
                                    fullWidth 
                                    disabled
                                />
                            </FormControl>
                        </Stack>
                    </Box>
                )}

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
                                    <Select 
                                        placeholder="Seleccione tipo de tarea"
                                        value={workOrder.tipo_tarea}
                                        onChange={(_, value) => handleInputChange('tipo_tarea', value as string)}
                                    >
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
                                        value={workOrder.descripcion}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Prioridad</FormLabel>
                                    <Select 
                                        placeholder="Seleccione prioridad"
                                        value={workOrder.prioridad}
                                        onChange={(_, value) => handleInputChange('prioridad', value as WorkOrderPriority)}
                                    >
                                        <Option value="alta">Alta</Option>
                                        <Option value="media">Media</Option>
                                        <Option value="baja">Baja</Option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Plazo</FormLabel>
                                    <Input 
                                        type="date" 
                                        fullWidth 
                                        value={workOrder.plazo.split('T')[0]}
                                        onChange={(e) => handleInputChange('plazo', e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Estado</FormLabel>
                                    <Select 
                                        value={workOrder.status}
                                        onChange={(_, value) => handleInputChange('status', value as WorkOrderStatus)}
                                    >
                                        <Option value="pendiente">Pendiente</Option>
                                        <Option value="en_proceso">En Proceso</Option>
                                        <Option value="completada">Completada</Option>
                                        <Option value="cancelada">Cancelada</Option>
                                    </Select>
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
                                        value={new Date(workOrder.created_at).toLocaleDateString()} 
                                        fullWidth 
                                        disabled
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Número de orden</FormLabel>
                                    <Input 
                                        value={workOrder.numero_orden} 
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
                    onClick={handleSubmit}
                >
                    Guardar Cambios
                </Button>
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                variant="soft"
                color="success"
                open={openSuccessSnackbar}
                onClose={() => setOpenSuccessSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                startDecorator={<CheckCircleOutlineRoundedIcon />}
                endDecorator={
                    <Button
                        onClick={() => setOpenSuccessSnackbar(false)}
                        size="sm"
                        variant="soft"
                        color="success"
                    >
                        Cerrar
                    </Button>
                }
            >
                Orden de trabajo actualizada exitosamente.
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
                variant="soft"
                color="danger"
                open={openErrorSnackbar}
                onClose={() => setOpenErrorSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                startDecorator={<ErrorOutlineRoundedIcon />}
                endDecorator={
                    <Button
                        onClick={() => setOpenErrorSnackbar(false)}
                        size="sm"
                        variant="soft"
                        color="danger"
                    >
                        Cerrar
                    </Button>
                }
            >
                {errorMessage || "Ocurrió un error inesperado"}
            </Snackbar>
        </Box>
    );
}