import { Component } from '@angular/core';
import { NewInvoiceFormComponent } from '../new-invoice-form/new-invoice-form.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-edit-invoice-form',
  standalone: true,
  templateUrl: '../new-invoice-form/new-invoice-form.component.html', // Use the same template
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavBarComponent], // Add CommonModule
  styleUrls: ['../new-invoice-form/new-invoice-form.component.scss'],
})
export class EditInvoiceFormComponent extends NewInvoiceFormComponent {
  override ngOnInit() {
    super.ngOnInit(); // Call parent's ngOnInit

    if (this.isEditMode && this.editingInvoiceId) {
      this.invoiceService.getInvoiceById(this.editingInvoiceId).subscribe({
        next: (invoice) => {
          if (invoice) {
            this.populateForm(invoice);
          } else {
            console.error('Invoice not found');
            this.router.navigate(['/invoices']);
          }
        },
        error: (err) => {
          console.error('Error loading invoice', err);
          this.router.navigate(['/invoices']);
        },
      });
    }
  }

  // Override the form title
  override getFormTitle(): string {
    return `Edit #${this.editingInvoiceId || ''}`;
  }
}
