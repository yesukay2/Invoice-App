import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'invoices',
    loadComponent: () =>
      import('../components/invoice-list/invoice-list.component').then(
        (m) => m.InvoiceListComponent
      ),
  },
  {
    path: 'invoices/new',
    loadComponent: () =>
      import('../components/new-invoice-form/new-invoice-form.component').then(
        (m) => m.NewInvoiceFormComponent
      ),
  },
  {
    path: 'invoices/delete',
    loadComponent: () =>
      import('../components/delete-modal/delete-modal.component').then(
        (m) => m.DeleteModalComponent
      ),
  },
  {
    path: 'invoices/:id',
    loadComponent: () =>
      import('../components/invoice-details/invoice-details.component').then(
        (m) => m.InvoiceDetailsComponent
      ),
  },

  {
    path: 'invoices/:id/edit',
    loadComponent: () =>
      import(
        '../components/edit-invoice-form/edit-invoice-form.component'
      ).then((m) => m.EditInvoiceFormComponent),
  },
];
