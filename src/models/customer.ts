export interface Customer {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  tinNumber: string;
  phone: string;
  address: string;
}

export interface CreateCustomer {
  firstName: string;
  middleName: string;
  lastName: string;
  tinNumber: string;
  phone: string;
  address: string;
}
