import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; //
import { OverdueDirective } from '../../directives/overdue.directive';

@Component({
  selector: 'app-invoice-item',
  standalone: true,
  imports: [CommonModule, OverdueDirective],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.scss',
})
export class InvoiceItemComponent {
  @Input({ required: true }) invoice!: Invoice;

  constructor(private router: Router) {} // ✅ Inject Router

  expandInvoice() {
    this.router.navigate(['/invoices', this.invoice.id]); // ✅ Navigate to invoice details route
  }
}
