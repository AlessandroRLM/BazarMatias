import { Button, Stack, Typography } from '@mui/joy'

interface Button {
  text: string
}

type Props = {
  title: string
  buttons?: Button[]
}

const PageHeader = (props: Props) => {
  return (
    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} sx={{ width: '100%' }}>
      <Typography level='h1'>
        {props.title}
      </Typography>
      <Stack direction={'row'} spacing={2} sx={{ width: 'fit-content' }}>
        {props?.buttons?.map((button) => (
          <Button variant="solid" color="primary" size="md" sx={{ borderRadius: 'var(--joy-radius-md)' }}>
            {button.text}
          </Button>
            ))}
      </Stack>
    </Stack>
  )
}

export default PageHeader