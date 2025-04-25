import React, { useState } from 'react'
import { Calendar } from '../Calendar/Calendar'
import { Input, FormControl, FormLabel, IconButton, Sheet, Box, Typography } from '@mui/joy'
import dayjs from 'dayjs'
import { CalendarToday, Clear } from '@mui/icons-material'

export interface DateRangePickerProps {
  label?: string
  startDate?: Date
  endDate?: Date
  onChange?: (dates: { start: Date | null; end: Date | null }) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  dateFormat?: string
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  startDate,
  endDate,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  required = false,
  dateFormat = 'MM/DD/YYYY',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selecting, setSelecting] = useState<'start' | 'end'>('start')
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate || null)
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate || null)

  const formatDateRange = () => {
    if (!tempStartDate && !tempEndDate) return ''
    if (tempStartDate && !tempEndDate) {
      return dayjs(tempStartDate).format(dateFormat)
    }
    if (tempStartDate && tempEndDate) {
      return `${dayjs(tempStartDate).format(dateFormat)} - ${dayjs(tempEndDate).format(dateFormat)}`
    }
    return ''
  }

  const handleCalendarSelect = (date: Date) => {
    if (selecting === 'start') {
      setTempStartDate(date)
      setSelecting('end')
      if (tempEndDate && dayjs(tempEndDate).isBefore(date)) {
        setTempEndDate(null)
      }
    } else {
      if (dayjs(date).isBefore(tempStartDate!)) {
        setTempStartDate(date)
        setTempEndDate(tempStartDate)
      } else {
        setTempEndDate(date)
        setIsOpen(false)
        onChange?.({ start: tempStartDate, end: date })
      }
      setSelecting('start')
    }
  }

  const handleSelectToday = () => {
    const today = new Date()
    setTempStartDate(today)
    setTempEndDate(today)
    setSelecting('start')
    setIsOpen(false)
    onChange?.({ start: today, end: today })
  }

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setSelecting('start')
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTempStartDate(null)
    setTempEndDate(null)
    setSelecting('start')
    setIsOpen(false)
    onChange?.({ start: null, end: null })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value) {
      handleClear(e as any)
      return
    }

    const dates = value.split('-').map(d => d.trim())
    if (dates.length === 2) {
      const start = dayjs(dates[0], dateFormat)
      const end = dayjs(dates[1], dateFormat)
      
      if (start.isValid() && end.isValid() && !end.isBefore(start)) {
        setTempStartDate(start.toDate())
        setTempEndDate(end.toDate())
        onChange?.({ start: start.toDate(), end: end.toDate() })
      }
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
            value={formatDateRange()}
            onChange={handleInputChange}
            onClick={toggleCalendar}
            placeholder={placeholder}
            disabled={disabled}
            endDecorator={
              <>
                {(tempStartDate || tempEndDate) && (
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
            <Box sx={{ position: 'absolute', zIndex: 1000, mt: 1, right: 0 }}>
              <Sheet
                variant="outlined"
                sx={{ p: 2, borderRadius: 'md' }}
              >
                <Typography level="body-sm" sx={{ mb: 1, color: 'neutral.500' }}>
                  {selecting === 'start' ? 'Select start date' : 'Select end date'}
                </Typography>
                <Calendar
                  value={selecting === 'start' ? tempStartDate || undefined : tempEndDate || undefined}
                  onSelectDate={handleCalendarSelect}
                  onSelectToday={handleSelectToday}
                />
              </Sheet>
            </Box>
          )}
        </Box>
      </FormControl>
    </Box>
  )
}