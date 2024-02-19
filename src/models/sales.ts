export interface CreateSales {
    invoiceDate: Date,
    invoiceNumber: number;
    customerId: string;
    productId: string;
    saleQuantity: number;
    saleUnitPrice: number;

}