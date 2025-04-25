import { ButtonProps, IconButton } from '@mui/joy'
import { createLink, LinkComponent } from '@tanstack/react-router'
import { forwardRef } from 'react'

type Props = ButtonProps

const IconLinkComponent = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
    return <IconButton component='a' color='primary' variant='plain' ref={ref} {...props}/>
})

const CreatedLink = createLink(IconLinkComponent)

const IconLink: LinkComponent<typeof IconLinkComponent> = (props) => {
    return <CreatedLink preload='intent' {...props}/> 
}

export default IconLink