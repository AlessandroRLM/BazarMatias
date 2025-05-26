export interface Client {
    id: string
    national_id: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
}


export interface QuoteDetail {
    id: string
    product: string
    quantity: number
    unit_price: number
}

export interface Quote {
    id: string
    client: string
    details: QuoteDetail[]
    status: string
    created_at: Date
    total: number
}