import { useEffect, useState } from "react"
import { Input, Select, Stack, Option } from "@mui/joy"
import useDebounce from "../../../hooks/core/useDebounce"
import { DateRangePicker } from "../DateRangeInput/DateRangeInput"
import { DatePicker } from "../DatePicker/DatePicker"
import dayjs from "dayjs"
import { Filters } from "../../../types/core.types"


export type SelectOption = {
    value: string | number | null
    label: string
}

export interface SelectConfig {
    id: string
    placeholder: string
    options: SelectOption[]
}

interface Props<T> {
    filters?: Filters<T>
    onChangeFilters: (dataFilters: Partial<T>) => void
    selects: SelectConfig[]
    dateRangePicker?: boolean
    dateRangePickerValue?: { start: Date | null; end: Date | null }
    datePicker?: boolean
    datePickerValue?: Date | null
}

const FilterOptions = <T,>(props: Props<T>) => {
    const {
        onChangeFilters,
        selects = [],
        dateRangePicker = false,
        dateRangePickerValue,
        datePicker = false,
        datePickerValue
    } = props

    const [inputValue, setInputValue] = useState<string>('')
    const debouncedInputValue = useDebounce<string>(inputValue, 500)

    useEffect(() => {
        setInputValue(debouncedInputValue)
        onChangeFilters({ search: inputValue } as Partial<T & { search: string }>)
    }, [debouncedInputValue])

    const handleSelectChange = (selectedId: string, selectedValue: {} | null) => {
        if (selectedValue !== null) {
            onChangeFilters({ [selectedId]: selectedValue } as Partial<T>)
        } else {
            onChangeFilters({ [selectedId]: undefined } as Partial<T>)
        }
    }

    const handleDateChange = (date: Date | null) => {
        onChangeFilters({ created_at: dayjs(date).format('YYYY-MM-DD') } as Partial<T> & { created_at: string })
    }

    const handleDateRangeChange = (dates: { start: Date | null; end: Date | null }) => {
        if (dates.start && dates.end){
            onChangeFilters({
                date__range_after: dayjs(dates.start).format('YYYY-MM-DD'),
                date__range_before: dayjs(dates.end).format('YYYY-MM-DD'),
            } as Partial<T> & { date__range_after: string, date__range_before: string })
        } else {
            onChangeFilters({
                date__range_after: undefined,
                date__range_before: undefined,
            } as unknown as Partial<T>)
        }
    }

    return (
        <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={1}
            sx={{
                width: '100%',
            }}
        >
            <Input
                variant="outlined"
                size="md"
                placeholder="Buscar..."
                onChange={(e) => {
                    setInputValue(e.target.value)
                }}
                sx={{
                    width: '100%',
                }}
            />
            {selects.map((select) => (
                <Select
                    key={select.id}
                    variant="outlined"
                    size="md"
                    placeholder={select.placeholder}
                    onChange={(_, newValue) => {
                        handleSelectChange(select.id, newValue)
                    }}
                    sx={{
                        width: '30%',
                    }}
                >
                    {select.options.map((option) => (
                        <Option key={String(option.value)} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            ))}
            {datePicker && (
                <DatePicker
                    value={datePickerValue || undefined}
                    onChange={handleDateChange}
                    placeholder="Selecciona una fecha"
                />
            )}
            {dateRangePicker && (
                <DateRangePicker
                    startDate={dateRangePickerValue?.start || undefined}
                    endDate={dateRangePickerValue?.end || undefined}
                    onChange={handleDateRangeChange}
                    placeholder="Selecciona un rango de fechas"
                />
            )}
        </Stack>
    )
}

export default FilterOptions