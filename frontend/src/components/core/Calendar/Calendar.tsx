import React, { useState, useEffect } from 'react'
import { Sheet, IconButton, Button, Typography, Box, Stack, Grid } from '@mui/joy'
import dayjs from 'dayjs'
import { KeyboardArrowLeft, KeyboardArrowRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material'

export interface CalendarProps {
    value?: Date
    onSelectDate?: (date: Date) => void
    onSelectToday?: () => void
}

export const Calendar: React.FC<CalendarProps> = ({
    value,
    onSelectDate,
    onSelectToday,
}) => {
    const [currentDate, setCurrentDate] = useState(value || new Date())
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)

    useEffect(() => {
        if (value) {
            setSelectedDate(value)
        }
    }, [value])

    const onDateClick = (day: Date) => {
        setSelectedDate(day)
        onSelectDate?.(day)
    }

    const nextMonth = () => {
        setCurrentDate(dayjs(currentDate).add(1, 'month').toDate())
    }

    const prevMonth = () => {
        setCurrentDate(dayjs(currentDate).subtract(1, 'month').toDate())
    }

    const nextYear = () => {
        setCurrentDate(dayjs(currentDate).add(1, 'year').toDate())
    }

    const prevYear = () => {
        setCurrentDate(dayjs(currentDate).subtract(1, 'year').toDate())
    }

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
        if (onSelectToday) {
            onSelectToday()
        } else {
            onSelectDate?.(today)
        }
    }

    const renderHeader = () => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, width: 'fit-content' }}>
                <Stack direction={'row'}>
                    <IconButton
                        variant="plain"
                        onClick={prevYear}
                        size="sm"
                        aria-label="Año Anterior"
                    >
                        <KeyboardDoubleArrowLeft />
                    </IconButton>
                    <IconButton
                        variant="plain"
                        onClick={prevMonth}
                        size="sm"
                        aria-label="Previous Month"
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                </Stack>
                <Typography level="title-md">
                    {dayjs(currentDate).format('MMMM YYYY')}
                </Typography>
                <Stack direction={'row'} >
                    <IconButton
                        variant="plain"
                        onClick={nextMonth}
                        size="sm"
                        aria-label="Siguiente Mes"
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                        variant="plain"
                        onClick={nextYear}
                        size="sm"
                        aria-label="Siguiente Año"
                    >
                        <KeyboardDoubleArrowRight />
                    </IconButton>
                </Stack>
            </Box>
        )
    }

    const renderDays = () => {
        const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

        return (
            <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
                {weekdays.map((day, i) => (
                    <Grid key={`weekday-${i}`}>
                        <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography level="body-sm" sx={{ color: 'neutral.500', fontWeight: 600 }}>
                                {day}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        )
    }


    const renderCells = () => {
        const monthStart = dayjs(currentDate).startOf('month')
        const monthEnd = dayjs(currentDate).endOf('month')
        const startDate = monthStart.startOf('week')
        const endDate = monthEnd.endOf('week')

        const rows = []
        let days = []
        let day = startDate

        while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day.toDate()
                const isCurrentMonth = day.isSame(monthStart, 'month')
                const isToday = day.isSame(dayjs(), 'day')
                const isSelected = selectedDate && day.isSame(selectedDate, 'day')

                days.push(
                    <Grid key={day.valueOf()}>
                        <Box
                            onClick={() => isCurrentMonth && onDateClick(cloneDay)}
                            sx={{
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isCurrentMonth ? 'pointer' : 'default',
                                borderRadius: '50%',
                                bgcolor: isSelected ? 'primary.500' : 'transparent',
                                border: isToday && !isSelected ? '1px solid' : 'none',
                                borderColor: 'primary.500',
                                '&:hover': {
                                    bgcolor: isCurrentMonth && !isSelected ? 'neutral.100' : undefined
                                }
                            }}
                        >
                            <Typography
                                level="body-sm"
                                sx={{
                                    color: !isCurrentMonth ? 'neutral.300' : isSelected ? 'white' : 'neutral.800'
                                }}
                            >
                                {day.format('D')}
                            </Typography>
                        </Box>
                    </Grid>
                )
                day = day.add(1, 'day')
            }
            rows.push(
                <Grid container spacing={0.5} key={day.valueOf()}>
                    {days}
                </Grid>
            )
            days = []
        }
        return <Box sx={{ mb: 1 }}>{rows}</Box>
    }

    return (
        <Sheet
            variant="outlined"
            sx={{
                p: 2,
                boxShadow: 'md',
                borderRadius: 'md',
                width: 300,
            }}
        >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                    onClick={goToToday}
                    variant="plain"
                    size="sm"
                    sx={{
                        color: 'primary.500',
                        '&:hover': {
                            bgcolor: 'primary.50'
                        }
                    }}
                >
                    Hoy
                </Button>
            </Box>
        </Sheet>
    )
}