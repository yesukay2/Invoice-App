import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../utils/interfaces/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  data!: Invoice[];
  constructor(private http: HttpClient) {}

  fetchInvoiceData() {
    this.http
      .get<Invoice[]>('assets/data/mock-invoices.json')
      .subscribe(
        (response: Invoice[]) => ((this.data = response), console.log(response))
      );
  }

  addNewInvoice(): void {}

  updateInvoice(id: number) {}

  deleteInvoice(id: number) {}
}
