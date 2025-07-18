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
import { createWorkOrder } from "../../../services/salesService";
import { WorkOrder, WorkOrderPriority } from "../../../types/sales.types";
import { getUsers } from "../../../services/userService";
import { User } from "../../../types/auth.types";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

export default function CreateOrder() {
    const [workers, setWorkers] = useState<User[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<string>("");
    const [workOrderData, setWorkOrderData] = useState<Omit<WorkOrder, 'id' | 'created_at' | 'numero_orden'>>({
        trabajador: {} as User,
        tipo_tarea: "",
        descripcion: "",
        prioridad: "media",
        plazo: new Date().toISOString().split('T')[0],
        status: "pendiente"
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // Estados para los Snackbars
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                setLoading(true);
                const users = await getUsers();
                
                if (!Array.isArray(users)) {
                    throw new Error("La respuesta no es un array");
                }

                setWorkers(users);
            } catch (error) {
                console.error("Error loading workers:", error);
                setErrorMessage("Error al cargar los trabajadores");
                setOpenErrorSnackbar(true);
                setWorkers([]);
            } finally {
                setLoading(false);
            }
        };
        loadWorkers();
    }, []);

    const handleWorkerChange = (value: string) => {
        const selected = workers.find(w => w.id === value);
        if (!selected) return;
        
        setSelectedWorker(value);
        setWorkOrderData(prev => ({
            ...prev,
            trabajador: selected
        }));
    };

    const handleInputChange = (field: keyof Omit<WorkOrder, 'id' | 'created_at' | 'numero_orden'>, value: string) => {
        setWorkOrderData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!workOrderData.trabajador?.id) {
                throw new Error("Debe seleccionar un trabajador");
            }
            
            setSubmitting(true);
            await createWorkOrder({
                ...workOrderData,
                trabajador: workOrderData.trabajador.id
            });
            
            setOpenSuccessSnackbar(true);
            
            // Redirigir después de un breve retraso para que el usuario vea el mensaje
            setTimeout(() => {
                window.location.href = '/ventas/ordenesdetrabajo';
            }, 1500);
            
        } catch (error) {
            console.error("Error creating work order:", error);
            setErrorMessage("Error al crear la orden de trabajo");
            setOpenErrorSnackbar(true);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedWorkerData = workers.find(w => w.id === selectedWorker);

    if (loading) return <div>Cargando trabajadores...</div>;

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
                <FormControl sx={{ mb: 3 }} required>
                    <FormLabel>Seleccionar Trabajador</FormLabel>
                    <Select 
                        placeholder={loading ? "Cargando trabajadores..." : "Seleccione un trabajador"}
                        value={selectedWorker}
                        onChange={(_, value) => handleWorkerChange(value as string)}
                        disabled={loading || workers.length === 0}
                    >
                        {workers.map(worker => (
                            <Option key={worker.id} value={worker.id}>
                                {`${worker.first_name} ${worker.last_name} (${worker.formatted_national_id}) - ${worker.position || 'Sin cargo'}`}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                {selectedWorkerData && (
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
                                    value={`${selectedWorkerData.first_name} ${selectedWorkerData.last_name}`} 
                                    fullWidth 
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>RUT</FormLabel>
                                <Input 
                                    value={selectedWorkerData.formatted_national_id} 
                                    fullWidth 
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Cargo</FormLabel>
                                <Input 
                                    value={selectedWorkerData.position || 'Sin cargo'} 
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
                                        value={workOrderData.tipo_tarea}
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
                                        value={workOrderData.descripcion}
                                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Prioridad</FormLabel>
                                    <Select 
                                        placeholder="Seleccione prioridad"
                                        value={workOrderData.prioridad}
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
                                        value={workOrderData.plazo}
                                        onChange={(e) => handleInputChange('plazo', e.target.value)}
                                    />
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
                                        value={new Date().toISOString().split('T')[0]}
                                        disabled
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
                    onClick={handleSubmit}
                    disabled={!selectedWorker || submitting}
                    loading={submitting}
                >
                    Confirmar
                </Button>
            </Box>

            {/* Snackbar de éxito */}
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
                Orden de trabajo creada exitosamente.
            </Snackbar>

            {/* Snackbar de error */}
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