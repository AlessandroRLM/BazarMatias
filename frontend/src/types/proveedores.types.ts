export interface Supplier {
    id:       string;
    name:     string;
    address:  string;
    phone:    string;
    email:    string;
    rut:      string;
    category: string;
}

export interface BuyOrder {
    id:           string;
    details:      BuyOrderDetail[];
    status:       string;
    created_at:   Date;
    net_amount:   number;
    iva:          number;
    total_amount: number;
    supplier:     string;
}

export interface BuyOrderDetail {
    id:         string;
    product:    string;
    quantity:   number;
    unit_price: number;
}
