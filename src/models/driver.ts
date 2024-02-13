export interface Driver {
    id?: string;
    name: string;
    truckNumber: string;
    djboutiPhone: string;
    ethiopiaPhone: string;
    associationName: string;
    associationPhone: string;
    ownerName: string;
    ownerPhone: string;
}

export interface CreateDriver {
    name: string;
    truckNumber: string;
    djboutiPhone: string;
    ethiopiaPhone: string;
    associationName: string;
    associationPhone: string;
    ownerName: string;
    ownerPhone: string;
}
