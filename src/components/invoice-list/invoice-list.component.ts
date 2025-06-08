import { Component, inject } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';
import { CommonModule } from '@angular/common';
import { EmptyListComponent } from '../empty-list/empty-list.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true, // Using standalone component (modern Angular approach)
  imports: [CommonModule, EmptyListComponent, InvoiceItemComponent], // Need CommonModule for *ngFor
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  private invoiceService = inject(InvoiceService);
  // invoices$ = this.invoiceService.fetchInvoiceData(); // Observable for async pipe

  // get invoices from localstorage

  // Count of invoices for display
  get invoiceCount(): number {
    console.log(this.invoiceService.getInvoices());
    return this.invoiceService.getInvoices().length;
  }
}
