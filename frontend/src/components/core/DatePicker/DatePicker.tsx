import React, { useState } from 'react'
import { Calendar, CalendarProps } from '../Calendar/Calendar'
import { Input, FormControl, FormLabel, IconButton, Box } from '@mui/joy'
import dayjs from 'dayjs'
import { CalendarToday, Clear } from '@mui/icons-material'

export interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | null) => void
  format?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  dateFormat?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  dateFormat = 'MM/DD/YYYY',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState<string>(
    value ? dayjs(value).format(dateFormat) : ''
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    if (newValue) {
      const parsedDate = dayjs(newValue, dateFormat)
      if (parsedDate.isValid()) {
        onChange?.(parsedDate.toDate())
      } else if (onChange && newValue === '') {
        onChange(null)
      }
    } else if (onChange) {
      onChange(null)
    }
  }

  const handleCalendarSelect: CalendarProps['onSelectDate'] = (date) => {
    if (date) {
      setInputValue(dayjs(date).format(dateFormat))
      onChange?.(date)
    }
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInputValue('')
    onChange?.(null)
    setIsOpen(false)
  }

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <FormControl>
        {label && (
          <FormLabel required={required}>
            {label}
          </FormLabel>
        )}
        <Box sx={{ position: 'relative' }}>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onClick={toggleCalendar}
            placeholder={placeholder}
            disabled={disabled}
            endDecorator={
              <>
                {inputValue && (
                  <IconButton
                    variant="plain"
                    color="neutral"
                    size="sm"
                    onClick={handleClear}
                    sx={{ mr: 0.5 }}
                  >
                    <Clear />
                  </IconButton>
                )}
                <CalendarToday
                  onClick={toggleCalendar}
                  style={{ cursor: 'pointer', color: 'var(--joy-palette-neutral-500)' }}
                  sx={{
                    '&:hover': { color: 'var(--joy-palette-primary-500)' }
                  }}
                />
              </>
            }
          />
          {isOpen && (
            <Box sx={{ position: 'absolute', zIndex: 1000, mt: 1, width: '100%', right: 0 }}>
              <Calendar
                value={value}
                onSelectDate={handleCalendarSelect}
              />
            </Box>
          )}
        </Box>
      </FormControl>
    </Box>
  )
}