import { ListItemButton } from '@mui/joy'
import { createLink, LinkComponent } from '@tanstack/react-router'

const CreatedLinkComponent = createLink(ListItemButton)

const SidebarLink: LinkComponent<typeof ListItemButton> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}

export default SidebarLink