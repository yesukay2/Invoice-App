import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  invoices$ = this.invoicesSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      this.invoicesSubject.next(JSON.parse(stored));
    } else {
      this.loadInitialData();
    }

    // Sync BehaviorSubject changes to localStorage
    this.invoices$.subscribe((invoices) => {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    });
  }

  private loadInitialData() {
    // Load from a mock JSON file or initialize empty array
    // If you want, you can remove this and just start with []
    fetch('assets/data/mock-invoices.json')
      .then((res) => res.json())
      .then((data: Invoice[]) => this.invoicesSubject.next(data))
      .catch(() => this.invoicesSubject.next([]));
  }

  getInvoices() {
    return this.invoices$;
  }

  getInvoiceById(id: string) {
    return this.invoices$.pipe(
      map((invoices: Invoice[]) =>
        invoices.find((inv: { id: string }) => inv.id === id)
      )
    );
  }

  addInvoice(invoice: Invoice) {
    const current = this.invoicesSubject.getValue();
    this.invoicesSubject.next([...current, invoice]);
  }

  updateInvoice(updated: Invoice) {
    const updatedList = this.invoicesSubject
      .getValue()
      .map((inv) => (inv.id === updated.id ? updated : inv));
    this.invoicesSubject.next(updatedList);
  }

  deleteInvoice(id: string) {
    const updatedList = this.invoicesSubject
      .getValue()
      .filter((inv) => inv.id !== id);
    this.invoicesSubject.next(updatedList);
  }
}
