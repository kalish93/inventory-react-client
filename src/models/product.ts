export interface Product{
    id: string;
    name: string;
    category: string;
    unitOfMeasurement: string;
}

export interface CreateProduct{
    name: string;
    category: string;
    unitOfMeasurement: string;
}