export interface Product {
    id:        string;
    name:      string;
    price_clp: number;
    iva:       boolean;
    stock:     number;
    category:  string;
    data:      Data;
    supplier:  string;
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