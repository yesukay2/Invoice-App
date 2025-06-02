export interface Invoice {
  id: number;
  clientName: string;
  items: Array<string>;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}
