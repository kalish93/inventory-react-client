export interface CreateDeclaration {
    number: string;
    date: Date;
    declarationProducts: CreateDeclarationProduct[];
  }

export interface CreateDeclarationProduct{
    productId: string;
    declarationQuantity: number;
    totalIncomeTax: number;
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