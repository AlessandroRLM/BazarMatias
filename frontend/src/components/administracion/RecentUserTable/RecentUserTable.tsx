import { Sheet, Table, Typography } from '@mui/joy'
import DashboardBox from '../../core/DashboardBox/DashboardBox'
import { User } from '../../../types/auth.types'
import dayjs from 'dayjs'

interface Props {
  recentUsers: User[]
}

const RecentUserTable = (props: Props) => {
  return (
    <DashboardBox>
      <Typography level='h4'>
        Usuarios recientes
      </Typography>
      <Sheet
        variant='outlined'
        sx={{
          borderRadius: 'var(--joy-radius-md)'
        }}
      >
        <Table
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
            overflow: 'auto'
          }}
        >
          <thead>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Cargo
              </th>
              <th>
                Ultimo Acceso
              </th>
            </tr>
          </thead>
          <tbody>
            {props?.recentUsers.map((user) => (
              <tr>
                <td style={{ fontSize: 'var(--joy-fontSize-xs)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.first_name + ' ' + user.last_name}
                </td>
                <td style={{ fontSize: 'var(--joy-fontSize-xs)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.position}
                </td>
                <td style={{ fontSize: 'var(--joy-fontSize-xs)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dayjs(user.last_login).isValid() ? dayjs(user.last_login).format('DD-MM-YYYY h:mm A') : 'No ha ingresado'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </DashboardBox>
  )
}

export default RecentUserTable