import { Typography, Box, IconButton, Dropdown, Menu, MenuButton, MenuItem, GlobalStyles, Sheet } from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from '@mui/icons-material/Menu';
import { toggleSidebar } from "../../../utils/sidebar.utils";

interface HeaderUserCreationProps {
  title?: React.ReactNode;
  subtitle?: string;
  onBack?: () => void;
  showMenu?: boolean;
  menuItems?: { label: string; onClick: () => void }[];
}

const HeaderUserCreation = ({ 
  title, 
  subtitle, 
  onBack, 
  showMenu = false, 
  menuItems = [] 
}: HeaderUserCreationProps) => {
  return (
    <>
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
      
      {/* Header móvil */}
      <Sheet
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0, 
          right: 0, 
          width: '100%', 
          height: 'var(--Header-height)',
          zIndex: 9995,
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'background.level1',
          boxShadow: 'sm',
        }}
      >
        {/* Contenedor izquierdo */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flex: '0 0 auto',
          alignItems: 'center'
        }}>
          <IconButton
            onClick={() => toggleSidebar()}
            variant="outlined"
            color="neutral"
            size="sm"
          >
            <MenuIcon />
          </IconButton>
          
          <IconButton
            onClick={onBack || (() => window.history.back())}
            variant="outlined"
            color="neutral"
            size="sm"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
        
        {/* Título centrado */}
        <Typography 
          level="h4" 
          component="h1" 
          sx={{ 
            flex: 1,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            px: 1,
            mx: 'auto',
            maxWidth: 'calc(100% - 160px)'
          }}
        >
          {title}
        </Typography>
        
        {/* Contenedor derecho */}
        <Box sx={{ 
          display: 'flex',
          flex: '0 0 auto',
          width: '34px',
          justifyContent: 'flex-end'
        }}>
          {showMenu && (
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { 
                  variant: 'outlined', 
                  color: 'neutral', 
                  size: 'sm' 
                } }}
              >
                <SettingsIcon />
              </MenuButton>
              <Menu>
                {menuItems.map((item, index) => (
                  <MenuItem key={index} onClick={item.onClick}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Dropdown>
          )}
        </Box>
      </Sheet>

      {/* Header desktop */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--joy-palette-divider)',
          marginBottom: 2,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onBack || (() => window.history.back())}
          variant="plain"
          color="neutral"
          size="lg"
          sx={{ zIndex: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography level="h4" component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography level="h2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {showMenu && (
          <Dropdown>
            <MenuButton
              slots={{ root: IconButton }}
              slotProps={{ root: { 
                variant: 'plain', 
                color: 'neutral', 
                size: 'lg', 
                sx: { zIndex: 1 } 
              } }}
            >
              <SettingsIcon />
            </MenuButton>
            <Menu>
              {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={item.onClick}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Dropdown>
        )}
      </Box>
    </>
  );
};

export default HeaderUserCreation;