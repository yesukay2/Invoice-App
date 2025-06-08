import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../utils/interfaces/invoice';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  // Store invoices in memory after fetching
  private invoices: Invoice[] = [];

  constructor(private http: HttpClient) {}

  // Fetch invoices and store them
  fetchInvoiceData(): Observable<Invoice[]> {
    const localStorageData: Invoice[] = JSON.parse(
      localStorage.getItem('invoices') || '[]'
    );

    if (localStorageData.length > 0) {
    }
    return this.http.get<Invoice[]>('assets/data/mock-invoices.json').pipe(
      tap((invoices) => {
        this.invoices = invoices;
      })
    );
  }

  // Getter for the invoices (could also use a BehaviorSubject for reactive updates)
  getInvoices(): Invoice[] {
    return this.invoices;
  }

  addNewInvoice(): void {}

  updateInvoice(id: number) {}

  deleteInvoice(id: number) {}
}
