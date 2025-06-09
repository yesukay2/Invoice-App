// delete-modal.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);

  invoiceId = this.route.snapshot.paramMap.get('id');

  cancel() {
    this.router.navigate(['/invoices', this.invoiceId]);
  }

  confirmDelete() {
    if (this.invoiceId) {
      this.invoiceService.deleteInvoice(this.invoiceId);
      this.router.navigate(['/invoices']);
    }
  }
}
