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
