import { Avatar, Box, ColorPaletteProp, Sheet, Stack, Typography } from '@mui/joy'
import { ReactNode } from 'react'

interface Props {
    title: string
    amount: number
    helperTitle?: string
    helperText?: string
    helperTextColor?: ColorPaletteProp
    subText?: string
    icon: ReactNode
}

const DashboardCard = (props: Props) => {
  return (
    <Sheet
        variant='outlined'
        sx={{
            width: '100%',
            height: '10rem',
            padding: 2,
            borderRadius: 'var(--joy-radius-md)'
        }}
    >
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Stack direction={'column'} justifyContent={'start'} spacing={2}>
                <Typography level='body-sm'>
                    {props?.title}
                </Typography>
                <Typography level='h3'>
                    {props?.amount}
                </Typography>
                <Typography level='body-xs' fontWeight={300}>
                    {props?.helperTitle}
                </Typography>
                <Typography level='body-xs' color={props?.helperTextColor} fontWeight={300}>
                    {props?.helperText}
                </Typography>
                <Typography level='body-xs' color={props?.helperTextColor} fontWeight={300}>
                    {props?.subText}
                </Typography>
            </Stack>
            <Box>
                <Avatar variant='soft' color='primary' sx={{width: '4rem', height: '4rem'}}>
                    {props?.icon ? props.icon : '?'}
                </Avatar>
            </Box>
        </Stack>
    </Sheet>
  )
}

export default DashboardCard