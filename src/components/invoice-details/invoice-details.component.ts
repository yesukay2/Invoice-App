// invoice-details.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { InvoiceDatePipe } from '../../pipes/date-format.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, InvoiceDatePipe],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);

  invoice?: Invoice;

  ngOnInit(): void {
    this.loadInvoice();
  }

  private loadInvoice() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceService.getInvoiceById(id).subscribe((invoice) => {
        this.invoice = invoice;
      });
    }
  }

  goBack() {
    this.router.navigate(['/invoices']);
  }

  editInvoice() {
    if (this.invoice) {
      // this.router.navigate(['/invoices', this.invoice.id, 'edit']);
      this.router.navigate([
        { outlets: { modal: ['invoices', this.invoice.id, 'edit'] } },
      ]);
    }
  }

  deleteInvoice() {
    if (this.invoice) {
      this.router.navigate(['/invoices', this.invoice.id, 'delete']);
    }
  }

  markAsPaid() {
    if (this.invoice && this.invoice.status !== 'paid') {
      const updatedInvoice = { ...this.invoice, status: 'paid' as const };
      this.invoiceService.updateInvoice(updatedInvoice);
      this.invoice = updatedInvoice;
    }
  }
}
