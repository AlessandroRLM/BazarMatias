import { ListItemButton, ExtendListItemButton, ListItemButtonTypeMap } from '@mui/joy'
import { createLink, LinkComponent } from '@tanstack/react-router'
import { forwardRef } from 'react'

type props = ExtendListItemButton<ListItemButtonTypeMap<{}, "div">>

const ListItemButtonLink = forwardRef<HTMLAnchorElement, props>((props, ref) => {
  return <ListItemButton {...props} ref={ref} component='a' />
})

const CreatedLinkComponent = createLink(ListItemButtonLink)

const SidebarLink: LinkComponent<typeof ListItemButtonLink> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}

export default SidebarLink