import Stack from '@mui/joy/Stack'
import { ReactNode } from 'react'


type Props = {
    children: ReactNode
}

const DashboardResponsiveDiv = (props: Props) => {
    return (
        <Stack direction={'row'} alignItems={'center'}
            sx={(theme) => ({
                gap: 1,
                flexWrap: 'wrap',
                [theme.breakpoints.up('sm')]: {
                    flexWrap: 'nowrap',
                }
            })}
        >
            {props.children}
        </Stack>
    )
}

export default DashboardResponsiveDiv