import { Component } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  imports: [],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceService.fetchInvoiceData();
  }
}
