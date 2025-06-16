export interface Product {
    id:        string;
    supplier:  string;
    supplier_name: string;
    is_below_min_stock: boolean;
    name:      string;
    price_clp: number;
    iva:       boolean;
    stock:     number;
    min_stock: number;
    category:  string;
    data:      Data;
}

export interface Data {
}

export interface ReturnSupplierParams {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
  ordering?: string;
}