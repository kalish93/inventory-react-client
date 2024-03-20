export interface CreatePurchase {
    number: number| null;
    date: Date | null;
    truckNumber: string | null;
    transportCost: number| null;
    eslCustomCost:number| null;
    transitFees: number| null;
    purchaseProducts: CreateProductPurchase[] | null;
    supplierId: string;
    exchangeRate: number| null;
    paidAmountUSD: number| null;
    paidAmountETB: number | null;
  }

export interface CreateProductPurchase{
    productId: string;
    declarationId: string;
    purchaseQuantity: number| null;
    purchaseUnitPrice: number| null;
}

export interface Purchase{
    id: string;
    number: string;
    date: Date;
    truckNumber: string;
    purchaseProducts: PurchaseProduct[];
}

export interface PurchaseProduct{
    productId: string;
    declarationId: string;
    purchaseQuantity: number;
    purchaseUnitPrice: number;
    purchaseTotal: number;
    transportCost: number;
    eslCustomCost: number;
    transitFees: number;
    purchaseUnitCogs: number;
}