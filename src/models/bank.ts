export interface Bank {
  id: String;
  name: String;
  address: String;
  startingValue: Number;
  stratingValueDate: Date;
  payee: String;
  foreignCurrency: Number;
  deposit: Number;
  payment: Number;
  type: String;
  chartOfAccountId: String;
  exchangeRate: Number;
  balance: Number;
}

export interface CreateBank {
  name: String;
  address: String;
  startingValue: Number;
  stratingValueDate: Date;
}
