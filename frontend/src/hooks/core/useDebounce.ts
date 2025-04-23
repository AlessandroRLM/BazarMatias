import { useEffect, useState } from "react"

const useDebounce = <T,>(value: T, delay: number = 500) => {
    const [debouncedValue, setDebounceValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, delay)

        return () => {
            clearTimeout(timer)
        }

    }, [value, delay])

    return debouncedValue
}

export default useDebounce