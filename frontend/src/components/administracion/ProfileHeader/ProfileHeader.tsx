import { Typography, Box, IconButton, Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Añadir esta importación

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
    <Box
      sx={{
        display: 'flex',
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
            slotProps={{
              root: {
                variant: 'plain',
                color: 'neutral',
                size: 'lg',
                sx: { zIndex: 1 }
              }
            }}
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
  );
};

export default HeaderUserCreation;