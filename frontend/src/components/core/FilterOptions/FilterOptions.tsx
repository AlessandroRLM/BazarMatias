import { Input, Select, Stack, Option } from "@mui/joy"
import { Filters } from "../../../types/core.types"
import { useEffect, useState } from "react"
import useDebounce from "../../../hooks/core/useDebounce"

// Definimos un tipo para las opciones del select que puede ser flexible
export type SelectOption = {
    value: string | number
    label: string
}

// Definimos el tipo para cada configuración de select
export interface SelectConfig {
    id: string // identificador único para cada select
    placeholder: string
    options: SelectOption[]
}


interface Props<T> {
    filters?: Filters<T>
    onChangeFilters: (dataFilters: Partial<T>) => void
    selects: SelectConfig[]
}

const FilterOptions = <T,>(props: Props<T>) => {
    const { onChangeFilters, selects = [] } = props
    const [inputValue, setInputValue] = useState<string>('')
    const debouncedValue = useDebounce<string>(inputValue, 500)

    useEffect(() => {
        setInputValue(debouncedValue)
        onChangeFilters({ search: inputValue } as Partial<T & { search: string }>)
    }, [debouncedValue])

    const handleSelectChange = (selectedId: string, selectedValue: {} | null) => {
        if (selectedValue !== null) {
            onChangeFilters({ [selectedId]: selectedValue } as Partial<T>)
        } else {
            onChangeFilters({ [selectedId]: undefined } as Partial<T>)
        }
    }

    return (
        <Stack
            direction={'row'}
            alignItems={'center'}
            spacing={0.5}
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
                        width: '20%',
                    }}
                >
                    {select.options.map((option) => (
                        <Option key={String(option.value)} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            ))}
        </Stack>
    )
}

export default FilterOptions