import { useSuspenseQuery } from "@tanstack/react-query"
import { userDetailQueryOptions } from "../../../utils/administracion/administracionQueryOptions"
import { Avatar, Box, Chip, Divider, Sheet, Stack, Typography } from "@mui/joy"
import { BusinessCenter, Cancel, CheckCircle, VerifiedUser } from "@mui/icons-material";

interface Props {
    userRut: string
}

const UserInfoCard = (props: Props) => {
    const userQuery = useSuspenseQuery(userDetailQueryOptions(props.userRut))
    const user = userQuery.data?.data

    return (
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
            <Stack direction="row" spacing={4} alignItems="flex-start" justifyContent="space-between">
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                        size="lg"
                        variant="soft"
                        color="primary"
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: "2.5rem"
                        }}
                    >
                        {(user?.first_name?.slice(0, 1) || '') + (user?.last_name?.slice(0, 1) || '')}
                    </Avatar>

                    <Stack spacing={2}>
                        <Typography
                            level="h2"
                        >
                            {user?.first_name} {user?.last_name}
                        </Typography>
                        <Typography level="title-lg" textColor="text.tertiary">
                            {user?.email}
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            <Chip
                                size="lg"
                                variant="soft"
                                color={user?.is_active ? 'success' : 'danger'}
                                startDecorator={user?.is_active ?
                                    <CheckCircle sx={{ fontSize: 20 }} /> :
                                    <Cancel sx={{ fontSize: 20 }} />
                                }
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    '--Chip-radius': '12px',
                                    '--Chip-gap': '8px',
                                }}
                            >
                                {user?.is_active ? 'Activo' : 'Inactivo'}
                            </Chip>
                            {user?.is_staff && (
                                <Chip
                                    size="lg"
                                    variant="soft"
                                    color="primary"
                                    startDecorator={<VerifiedUser sx={{ fontSize: 20 }} />}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        '--Chip-radius': '12px',
                                        '--Chip-gap': '8px',
                                    }}
                                >
                                    Staff
                                </Chip>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={4}>
                <InfoRow
                    label="ID"
                    value={user?.id}
                />
                <InfoRow
                    label="Identificación Nacional"
                    value={user?.formatted_national_id || user?.national_id}
                />
                <InfoRow
                    label="Posición"
                    value={user?.position}
                    icon={<BusinessCenter sx={{ fontSize: 22 }} />}
                />
            </Stack>
        </Sheet>
    );
};

interface InfoRowProps {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon }) => {
    if (!value) return null;

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                py: 2,
                px: 3,
                borderRadius: 'lg',
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'background.level1',
                    transform: 'translateX(8px)'
                }
            }}
        >
            <Typography
                level="title-md"
                textColor="text.secondary"
                sx={{ fontWeight: 500 }}
            >
                {label}
            </Typography>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >
                {icon && (
                    <Box sx={{
                        color: 'primary.500',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.1)'
                        }
                    }}>
                        {icon}
                    </Box>
                )}
                <Typography
                    level="title-md"
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary'
                    }}
                >
                    {value}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default UserInfoCard