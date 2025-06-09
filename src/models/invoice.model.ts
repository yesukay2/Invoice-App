export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  status: 'draft' | 'pending' | 'paid';
  paymentTerms: number;
  description: string;
  createdAt: string;
  items: InvoiceItem[];
  total: number;
}

export interface RawItem {
  itemName: string;
  itemQty: number;
  itemPrice: number;
}
