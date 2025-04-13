import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import IconButton from '@mui/joy/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const rows = [
  { rut: '12345678-9', name: 'Olivia Ryhe', email: 'olivia@email.com', role: 'Admin' },
  { rut: '98765432-1', name: 'Steve Hampton', email: 'steve.hamp@email.com', role: 'Bodegero' },
  { rut: '45678901-2', name: 'Ciaran Murray', email: 'ciaran.murray@email.com', role: 'Bodegero' },
  { rut: '78901234-5', name: 'Maria Macdonald', email: 'maria.mc@email.com', role: 'Vendedor' },
];

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof typeof rows[0]>('rut');
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleSort = (property: keyof typeof rows[0]) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      sx={{
        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
        '--Table-headerUnderlineThickness': '1px',
        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
        '--TableCell-paddingY': '4px',
        '--TableCell-paddingX': '8px',
      }}
    >
      <thead>
        <tr>
          <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
            <Checkbox
              size="sm"
              indeterminate={selected.length > 0 && selected.length !== rows.length}
              checked={selected.length === rows.length}
              onChange={(event) => {
                setSelected(event.target.checked ? rows.map((row) => row.rut) : []);
              }}
              color={selected.length > 0 || selected.length === rows.length ? 'primary' : undefined}
              sx={{ verticalAlign: 'text-bottom' }}
            />
          </th>
          <th style={{ width: 120, padding: '12px 6px' }}>
            <Link
              underline="none"
              color="primary"
              component="button"
              onClick={() => handleSort('rut')}
              endDecorator={<ArrowDropDownIcon />}
              sx={{
                fontWeight: 'lg',
                '& svg': {
                  transition: '0.2s',
                  transform: orderBy === 'rut' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
              }}
            >
              Rut
            </Link>
          </th>
          <th style={{ width: 140, padding: '12px 6px' }}>
            <Link
              underline="none"
              color="primary"
              component="button"
              onClick={() => handleSort('name')}
              endDecorator={<ArrowDropDownIcon />}
              sx={{
                fontWeight: 'lg',
                '& svg': {
                  transition: '0.2s',
                  transform: orderBy === 'name' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
              }}
            >
              Nombre
            </Link>
          </th>
          <th style={{ width: 140, padding: '12px 6px' }}>
            <Link
              underline="none"
              color="primary"
              component="button"
              onClick={() => handleSort('email')}
              endDecorator={<ArrowDropDownIcon />}
              sx={{
                fontWeight: 'lg',
                '& svg': {
                  transition: '0.2s',
                  transform: orderBy === 'email' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
              }}
            >
              Correo
            </Link>
          </th>
          <th style={{ width: 140, padding: '12px 6px' }}>
            <Link
              underline="none"
              color="primary"
              component="button"
              onClick={() => handleSort('role')}
              endDecorator={<ArrowDropDownIcon />}
              sx={{
                fontWeight: 'lg',
                '& svg': {
                  transition: '0.2s',
                  transform: orderBy === 'role' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                },
              }}
            >
              Cargo
            </Link>
          </th>
          <th style={{ width: 140, padding: '12px 6px' }}>
            <Typography fontWeight="lg">Acciones</Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {[...rows].sort(getComparator(order, orderBy)).map((row) => (
          <tr key={row.rut}>
            <td style={{ textAlign: 'center', width: 120 }}>
              <Checkbox
                size="sm"
                checked={selected.includes(row.rut)}
                color={selected.includes(row.rut) ? 'primary' : undefined}
                onChange={(event) => {
                  setSelected((ids) =>
                    event.target.checked ? ids.concat(row.rut) : ids.filter((id) => id !== row.rut),
                  );
                }}
                sx={{ verticalAlign: 'text-bottom' }}
              />
            </td>
            <td>
              <Typography level="body-xs">{row.rut}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.name}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.email}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.role}</Typography>
            </td>
            <td>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  ml: -3, 
                }}
              >
                <IconButton
                  variant="plain"
                  color="neutral"
                  size="sm"
                  aria-label="View"
                  onClick={() => console.log('View clicked')}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  variant="plain"
                  color="neutral"
                  size="sm"
                  aria-label="Edit"
                  onClick={() => console.log('Edit clicked')}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  variant="plain"
                  color="danger"
                  size="sm"
                  aria-label="Delete"
                  onClick={() => console.log('Delete clicked')}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
