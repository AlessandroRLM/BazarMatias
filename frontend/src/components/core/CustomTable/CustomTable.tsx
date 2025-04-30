import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  PaginationOptions,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Button, Link, Select, Sheet, Stack, Table, Typography, Option } from "@mui/joy"
import ArrowDropDown from "@mui/icons-material/ArrowDropDown"

export const DEFAULT_PAGE_INDEX = 0
export const DEFAULT_PAGE_SIZE = 10

type Props<T extends Record<string, any>> = {
  data: T[]
  columns: ColumnDef<T>[]
  pagination: PaginationState
  paginationOptions: Pick<PaginationOptions, "onPaginationChange" | "rowCount">
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
}

export default function CustomTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  paginationOptions,
  sorting,
  onSortingChange,
}: Props<T>) {

  const labelDisplayedRows = ({ from, to, count }: { from: number, to: number, count: number }) => {
    return `${from}-${to} de ${count}`
  }

  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting },
    onSortingChange,
    ...paginationOptions,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Sheet
      className="OrderTableContainer"
      variant="outlined"
      sx={{
        display: { xs: 'none', sm: 'initial' },
        width: '100%',
        borderRadius: 'sm',
        flexShrink: 1,
        overflow: 'auto',
        minHeight: 0,
      }}
    >
      <Table
        stickyHeader
        sx={{
          '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
          '--Table-headerUnderlineThickness': '1px',
          '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
          '--TableCell-paddingY': '4px',
          '--TableCell-paddingX': '8px',
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th style={{padding: '12px 6px'}} key={header.id} colSpan={header.colSpan} >
                    {header.isPlaceholder ? null :
                      header.column.getCanSort() ? (
                      <Link
                        {...{ onClick: header.column.getToggleSortingHandler() }}
                        key={header.id}
                        underline="none"
                        color="neutral"
                        component={'a'}
                        endDecorator={<ArrowDropDown />}
                        sx={[
                          header.column.getCanSort() && {
                            '&:hover': {
                              textDecoration: 'none',
                              color: 'primary.plainColor',
                            },
                            '& svg': {
                              transition: '0.2s',
                              transform: 'rotate(0deg)'
                            }
                          },

                          header.column.getIsSorted() && {
                            color: 'primary.plainColor',
                            fontWeight: 'bold',
                          },

                          header.column.getIsSorted() === 'desc' && {
                            '& svg': { transform: 'rotate(0deg)' }
                          },

                          header.column.getIsSorted() === 'asc' && {
                            '& svg': { transform: 'rotate(180deg)' }
                          },

                        ]}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Link>) : (
                        <Typography level='body-sm' color="neutral" fontWeight={600}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Typography>
                      )
                    }
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody >
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td style={{fontSize: 'var(--joy-fontSize-xs)', overflow: 'hidden', textOverflow: 'ellipsis'}} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length}>
              <Stack direction={'row'} justifyContent={'flex-end'} alignItems={'center'} spacing={1} sx={{ padding: '.5rem 1rem' }}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography level='body-sm' color="neutral">
                    Filas por pagina:
                  </Typography>
                  <Select
                    value={table.getState().pagination.pageSize}
                    onChange={(_, newValue) => {
                      if (newValue !== null) {
                        table.setPageSize(Number(newValue));
                      }
                    }}
                  >
                    {[5, 10, 20, 50, 100].map((pageSize) => (
                      <Option key={pageSize} value={pageSize}>
                        {pageSize}
                      </Option>
                    ))}
                  </Select>
                </Stack>
                <Typography level='body-sm' color="neutral">
                  {labelDisplayedRows({
                    from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
                    to: Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getRowCount()),
                    count: table.getRowCount(),
                  })}
                </Typography>

                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Button variant="outlined" color="neutral" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {'<'}
                  </Button>
                  <Button variant="outlined" color="neutral" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {'>'}
                  </Button>
                </Stack>

              </Stack>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  )


}