import { Stack, Typography } from '@mui/joy'
import { ReactNode } from '@tanstack/react-router'

type Props = {
    title: string
    buttons?: ReactNode[]
}

const PageHeader = (props: Props) => {
  return (
    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} sx={{ width: '100%'}}>
        <Typography level='h1'>
            {props.title}
        </Typography>
        <Stack direction={'row'} spacing={2} sx={{width: 'fit-content'}}>
            {props?.buttons}
        </Stack>
    </Stack>
  )
}

export default PageHeader