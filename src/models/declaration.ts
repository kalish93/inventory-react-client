export interface CreateDeclaration {
    number: string;
    date: any | null;
    declarationProducts: CreateDeclarationProduct[];
  }

export interface CreateDeclarationProduct{
    productId: string;
    declarationQuantity: number | null;
    totalIncomeTax: number | null;
}

export interface Declaration{
    id: string;
    number: string;
    date: Date;
    declarationProducts: DeclarationProduct[];
}

export interface DeclarationProduct{
    productId: string;
    declarationQuantity: number;
    totalIncomeTax: number;
    purchasedQuantity: number;
    declarationBalance: number;
    unitIncomeTax: number;
}