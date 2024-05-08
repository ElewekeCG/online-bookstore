export interface Product {
    name: string;
    quantity: number;
}

export interface Observer {
    update(product: Product[]): void;
}