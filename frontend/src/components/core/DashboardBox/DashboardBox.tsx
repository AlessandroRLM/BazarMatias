import { Box, Sheet } from '@mui/joy'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const DashboardBox = (props: Props) => {
  return (
    <Sheet
      variant='outlined'
      sx={{
        width: '100%',
        height: '31.875rem',
        borderRadius: 'var(--joy-radius-md)',
        padding: 3
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {props.children}
      </Box>
    </Sheet>
  )
}

export default DashboardBox