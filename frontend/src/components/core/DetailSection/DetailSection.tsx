import { Stack, Box, Typography, Tooltip } from "@mui/joy";

interface DetailSectionProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    tooltip?: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({ label, value, icon, tooltip }) => {
    const content = (
        <Stack spacing={1.5}>
            <Stack direction="row" spacing={2} alignItems="center">
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
                    textColor="text.secondary"
                    sx={{ fontWeight: 500 }}
                >
                    {label}
                </Typography>
            </Stack>
            <Typography
                level="title-lg"
                sx={{
                    fontWeight: 600,
                    ...(tooltip && {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'help'
                    })
                }}
            >
                {value}
            </Typography>
        </Stack>
    );

    return tooltip ? (
        <Tooltip
            title={value}
            variant="soft"
            placement="bottom-start"
            sx={{ maxWidth: '100%' }}
        >
            {content}
        </Tooltip>
    ) : content;
};

export default DetailSection