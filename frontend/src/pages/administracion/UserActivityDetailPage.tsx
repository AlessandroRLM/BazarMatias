import { useSuspenseQuery } from "@tanstack/react-query"
import { userActivityDetailQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import { useParams } from "@tanstack/react-router"
import { Box, Chip, Divider, Sheet, Stack, Typography } from "@mui/joy"
import UserInfoCard from "../../components/administracion/UserInfoCard/UserInfoCard"
import { AccessTime, Assessment, CheckCircleOutline, Computer, ErrorOutline, Language, WarningOutlined } from "@mui/icons-material"
import dayjs from "dayjs"
import DetailSection from "../../components/core/DetailSection/DetailSection"

const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 400 && statusCode < 500) return 'warning';
    if (statusCode >= 500) return 'danger';
    return 'neutral';
};

const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return <CheckCircleOutline />;
    if (statusCode >= 400 && statusCode < 500) return <WarningOutlined />;
    if (statusCode >= 500) return <ErrorOutline />;
    return null;
};

const UserActivityDetailPage = () => {
    const id = useParams({ from: '/_auth/administracion/usuarios/actividad-de-usuario/$id' }).id
    const query = useSuspenseQuery(userActivityDetailQueryOptions(id))
    const activity = query.data?.data

    return (
        <Stack
            direction="row"
            spacing={2.5}
        >
            <Sheet
                variant="outlined"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    minWidth: '600px',
                    height: 'fit-content',
                    padding: 4,
                    borderRadius: 'lg',
                    gap: 4,
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: 'sm',
                    bgcolor: 'background.surface',
                    '&:hover': {
                        boxShadow: 'md',
                    }
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Assessment sx={{ fontSize: 28 }} />
                    <Typography
                        level="h3"
                    >
                        Detalle de Actividad
                    </Typography>
                </Stack>

                <Stack spacing={4}>
                    <Box>
                        <Typography
                            level="title-md"
                            textColor="text.secondary"
                            sx={{ mb: 1.5, fontWeight: 500 }}
                        >
                            Descripción
                        </Typography>
                        <Typography
                            level="h4"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.4
                            }}
                        >
                            {activity.description}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Chip
                            size="lg"
                            variant="soft"
                            startDecorator={<AccessTime sx={{ fontSize: 20 }} />}
                            sx={{
                                py: 1.5,
                                px: 2,
                                '--Chip-radius': '12px',
                                '--Chip-gap': '8px',
                            }}
                        >
                            {dayjs(activity.timestamp).locale('es').format('D [de] MMMM, YYYY HH:mm:ss')}
                        </Chip>
                        {activity.data?.status_code && (
                            <Chip
                                size="lg"
                                variant="soft"
                                color={getStatusColor(activity.data.status_code)}
                                startDecorator={getStatusIcon(activity.data.status_code)}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    '--Chip-radius': '12px',
                                    '--Chip-gap': '8px',
                                }}
                            >
                                {activity.data.status_code} {activity.data.status_type}
                            </Chip>
                        )}
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={4}>
                    <DetailSection
                        label="Tipo de Acción"
                        value={activity.action_type}
                    />

                    {activity.data?.path && (
                        <DetailSection
                            label="Ruta"
                            value={activity.data.path}
                        />
                    )}

                    <Stack spacing={4}>
                        <DetailSection
                            label="Dirección IP"
                            value={activity.ip_address}
                            icon={<Language sx={{ fontSize: 22 }} />}
                        />

                        <DetailSection
                            label="Agente de Usuario"
                            value={activity.user_agent}
                            icon={<Computer sx={{ fontSize: 22 }} />}
                            tooltip
                        />
                    </Stack>
                </Stack>
            </Sheet>
            <UserInfoCard userRut={activity.user.national_id} />
        </Stack>
    );
};

export default UserActivityDetailPage;