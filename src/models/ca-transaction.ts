export interface CreateCATransaction {
  chartofAccountId1: string;
  chartofAccountId2: string;
  date: Date;
  remark?: string;
  debit?: number;
  credit?: number;
  accountDetails?: number;
}

export interface CATransaction{
    id: string;
    bankTransactionId: string;
    chartofAccount: string;
    chartofAccountId: string;
    type: string;
    date: Date;
    remark?: string;
    debit?: number;
    credit?: number;
    accountDetails?: number;
    purchaseNumber?: number;
    declarationNumbers?: [];
    invoiceNumber?: number;

}
