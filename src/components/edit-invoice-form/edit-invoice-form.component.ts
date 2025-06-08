import { Component } from '@angular/core';
import { NewInvoiceFormComponent } from '../new-invoice-form/new-invoice-form.component';

@Component({
  selector: 'app-edit-invoice-form',
  imports: [],
  templateUrl: './edit-invoice-form.component.html',
  styleUrl: './edit-invoice-form.component.scss',
})
export class EditInvoiceFormComponent extends NewInvoiceFormComponent {}
