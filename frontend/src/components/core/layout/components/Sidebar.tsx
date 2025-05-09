import { Avatar, Box, IconButton, List, ListItem, ListItemButton, ListItemContent, Sheet, Typography } from "@mui/joy"
import { Dispatch, SetStateAction, ReactNode, useState } from "react"
import { closeSidebar } from "../../../../utils/sidebar.utils"
import LockIcon from '@mui/icons-material/Lock'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import WorkIcon from '@mui/icons-material/Work'
import LogoutIcon from '@mui/icons-material/Logout';
import { KeyboardArrowDown } from "@mui/icons-material"
import SidebarLink from "./SidebarLink"
import { useAuth } from "../../../../hooks/auth/useAuth"

interface TogglerProps {
    defaultExpanded?: boolean
    renderToggle: (params: {
        open: boolean
        setOpen: Dispatch<SetStateAction<boolean>>
    }) => ReactNode
    children: ReactNode
}

const Toggler = ({ defaultExpanded = false, renderToggle, children }: TogglerProps) => {
    const [open, setOpen] = useState(defaultExpanded);
    return (
        <>
            {renderToggle({ open, setOpen })}
            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': {
                            overflow: 'hidden',
                        },
                    },
                    open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
                ]}
            >
                {children}
            </Box>
        </>
    );
}

const SidebarOverlay = () => {
    return (
        <Box
            className="Sidebar-overlay"
            sx={{
                position: 'fixed',
                zIndex: 9998,
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                opacity: 'var(--SideNavigation-slideIn)',
                backgroundColor: 'var(--joy-palette-background-backdrop)',
                transition: 'opacity 0.4s',
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                    lg: 'translateX(-100%)',
                },
            }}
            onClick={() => closeSidebar()}
        />
    )
}

const SidebarHeader = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                borderBottom: '1px solid var(--joy-palette-divider)'
            }}
        >
            <SidebarLink to="/home">
                <Typography level="h3" sx={{ cursor: 'pointer' }}>
                    Bazar Matias
                </Typography>
            </SidebarLink>
        </Box>
    )
}

const SidebarAdminList = () => {
    return (
        <ListItem nested>
            <Toggler
                renderToggle={({ open, setOpen }) => (
                    <ListItemButton onClick={() => setOpen(!open)}>
                        <LockIcon />
                        <ListItemContent>
                            <Typography level="title-sm">
                                Administración
                            </Typography>
                        </ListItemContent>
                        <KeyboardArrowDown
                            sx={[
                                open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                            ]}
                        />
                    </ListItemButton>
                )}
            >
                <List sx={{ gap: 0.5 }}>
                    <ListItem>
                        <SidebarLink to="/administracion/usuarios">
                            Gestión de Usuarios
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/administracion/usuarios/actividad-de-usuarios">
                            Gestión de Actividad de los Usuarios
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/administracion/perfil" >
                            Gestión de Perfil
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/administracion/dashboard">
                            Dashboard
                        </SidebarLink>
                    </ListItem>
                </List>
            </Toggler>
        </ListItem>
    )
}

const SidebarInventorykList = () => {
    return (
        <ListItem nested>
            <Toggler
                renderToggle={({ open, setOpen }) => (
                    <ListItemButton onClick={() => setOpen(!open)}>
                        <InventoryIcon />
                        <ListItemContent>
                            <Typography level="title-sm">
                                Inventario
                            </Typography>
                        </ListItemContent>
                        <KeyboardArrowDown
                            sx={[
                                open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                            ]}
                        />
                    </ListItemButton>
                )}
            >
                <List sx={{ gap: 0.5 }}>
                    <ListItem>
                        <SidebarLink to="/inventario/productos">
                            Gestión de Productos
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/inventario/insumos">
                            Gestión de Insumos
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/inventario/mermas">
                            Gestión de Mermas
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/inventario/dashboard">
                            Dashboard
                        </SidebarLink>
                    </ListItem>
                </List>
            </Toggler>
        </ListItem>
    )
}

const SidebarSalesList = () => {
    return (
        <ListItem nested>
            <Toggler
                renderToggle={({ open, setOpen }) => (
                    <ListItemButton onClick={() => setOpen(!open)}>
                        <ShoppingCartIcon />
                        <ListItemContent>
                            <Typography level="title-sm">
                                Ventas
                            </Typography>
                        </ListItemContent>
                        <KeyboardArrowDown
                            sx={[
                                open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                            ]}
                        />
                    </ListItemButton>
                )}
            >
                <List sx={{ gap: 0.5 }}>
                    <ListItem>
                        <SidebarLink to=".">
                            Gestión de Clientes
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to=".">
                            Gestión de Ventas
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to=".">
                            Gestión de Devoluciones
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to=".">
                            Gestión de Cotizaciones
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/ventas/ordenesdetrabajo">
                            Gestión de Ordenes de Trabajo
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to=".">
                            Dashboard
                        </SidebarLink>
                    </ListItem>
                </List>
            </Toggler>
        </ListItem>
    )
}

const SidebarSuppliersList = () => {
    return (
        <ListItem nested>
            <Toggler
                renderToggle={({ open, setOpen }) => (
                    <ListItemButton onClick={() => setOpen(!open)}>
                        <WorkIcon />
                        <ListItemContent>
                            <Typography level="title-sm">
                                Proveedores
                            </Typography>
                        </ListItemContent>
                        <KeyboardArrowDown
                            sx={[
                                open ? { transform: 'rotate(180deg)' } : { transform: 'none' },
                            ]}
                        />
                    </ListItemButton>
                )}
            >
                <List sx={{ gap: 0.5 }}>
                    <ListItem>
                        <SidebarLink to="/proveedores/proveedores">
                            Gestión de Proveedores
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/proveedores/devoluciones">
                            Gestión de Devoluciones
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/proveedores/ordenesdecompra">
                            Gestión de Ordenes de compra
                        </SidebarLink>
                    </ListItem>
                    <ListItem>
                        <SidebarLink to="/proveedores/proveedores/dashboard">
                            Dashboard
                        </SidebarLink>
                    </ListItem>
                </List>
            </Toggler>
        </ListItem>
    )
}

const SidebarContent = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            <List
                size="sm"
                sx={{
                    gap: 1,
                    '--List-nestedInsetStart': '30px',
                    '--ListItem-radius': (theme) => theme.vars.radius.md,
                }}
            >
                <SidebarAdminList />
                <SidebarInventorykList />
                <SidebarSalesList />
                <SidebarSuppliersList />
            </List>
        </Box>
    )
}

const SidebarFooter = () => {
    const {logout, user} = useAuth()

    return (
        <Box
            sx={{
                width: '100%',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                borderTop: '1px solid var(--joy-palette-divider)',
                padding: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 0.5,
                    padding: 0,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}
            >
                <Avatar variant="soft" color="primary" size="md" >
                    {(user?.first_name?.slice(0, 1) ?? 'A') + (user?.last_name?.slice(0, 1) ?? 'A')}
                </Avatar>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        padding: 0,
                    }}
                >
                    <Typography level='body-sm' textOverflow={'ellipsis'} fontWeight='bold'>{user?.first_name + ' ' + user?.last_name.slice(0, 1) + '.'}</Typography>
                    <Typography level='body-xs'> {user?.position} </Typography>
                </Box>
                <IconButton onClick={() => logout()}>
                    <LogoutIcon/>
                </IconButton>
            </Box>
        </Box>
    )
}

const Sidebar = () => {
    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                padding: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <SidebarOverlay />
            <SidebarHeader />
            <SidebarContent />
            <SidebarFooter />

        </Sheet>
    )
}

export default Sidebar