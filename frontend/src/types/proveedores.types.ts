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

export interface BuyOrdersParams {
  page?: number;
  page_size?: number;
  status?: 'PE' | 'AP' | 'RE';
  search?: string;
  ordering?: string;
}

export interface ReturnSupplierList {
    id:              string;
    status:          string;
    status_display:  string;
    supplier_name:   string;
    purchase_number: string;
    return_date:     Date;
    total_items:     number;
    total_products:  number;
}