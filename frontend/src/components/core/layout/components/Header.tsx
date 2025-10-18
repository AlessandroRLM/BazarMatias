import { Sheet, GlobalStyles, IconButton, Box } from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toggleSidebar } from "../../../../utils/sidebar.utils";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header = ({ showBackButton = false, onBack }: HeaderProps) => {
    return (
        <Sheet
            sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                top: 0,
                width: '100vw',
                height: 'var(--Header-height)',
                zIndex: 995,
                p: 2,
                gap: 1,
                borderBottom: '1px solid',
                borderColor: 'background.level1',
                boxShadow: 'sm',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Header-height': '52px',
                        [theme.breakpoints.up('md')]: {
                            '--Header-height': '0px',
                        },
                    },
                })}
            />
            
            {/* Contenedor izquierdo con botones */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Botón de menú siempre visible en móvil */}
                <IconButton
                    onClick={() => toggleSidebar()}
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <MenuIcon />
                </IconButton>

                {/* Botón de retroceso (opcional) */}
                {showBackButton && (
                    <IconButton
                        onClick={onBack || (() => window.history.back())}
                        variant="outlined"
                        color="neutral"
                        size="sm"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}
            </Box>
        </Sheet>
    )
}

export default Header;