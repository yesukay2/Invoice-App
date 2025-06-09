import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';
import { EmptyListComponent } from '../empty-list/empty-list.component';
import { RouterModule, Router } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EmptyListComponent,
    InvoiceItemComponent,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  invoices$ = this.invoiceService.invoices$;

  // Create reactive selectedStatus
  protected selectedStatus = new BehaviorSubject<string>('All');

  filteredInvoices$ = combineLatest([this.invoices$, this.selectedStatus]).pipe(
    map(([invoices, selectedStatus]) =>
      selectedStatus.toLowerCase() === 'all'
        ? invoices
        : invoices.filter(
            (inv) => inv.status.toLowerCase() === selectedStatus.toLowerCase()
          )
    )
  );

  // For reactive count
  invoiceCount$ = this.invoices$.pipe(map((invoices) => invoices.length));

  // Dropdown toggle state
  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectStatus(status: string) {
    this.selectedStatus.next(status);
    this.showDropdown = false; // Close dropdown after selection
  }

  newInvoiceModal() {
    this.router.navigate([{ outlets: { modal: ['invoices', 'new'] } }]);
  }
}
