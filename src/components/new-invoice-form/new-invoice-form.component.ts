import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-new-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-invoice-form.component.html',
  styleUrl: './new-invoice-form.component.scss',
})
export class NewInvoiceFormComponent {
  private invoiceService = inject(InvoiceService);

  newInvoiceForm = new FormGroup({
    fromStreetAddress: new FormControl(''),
    fromCity: new FormControl(''),
    fromPostCode: new FormControl(''),
    fromCountry: new FormControl(''),
    clientName: new FormControl(''),
    clientEmail: new FormControl(''),
    toStreetAddress: new FormControl(''),
    toCity: new FormControl(''),
    toPostCode: new FormControl(''),
    toCountry: new FormControl(''),
    date: new FormControl(''),
    paymentTerms: new FormControl('7'),
    description: new FormControl(''),
    items: new FormArray([
      new FormGroup({
        itemName: new FormControl(''),
        itemQty: new FormControl(1),
        itemPrice: new FormControl(0),
        itemTotal: new FormControl({ value: 0, disabled: true }),
      }),
    ]),
  });

  get items() {
    return this.newInvoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(
      new FormGroup({
        itemName: new FormControl(''),
        itemQty: new FormControl(1),
        itemPrice: new FormControl(0),
        itemTotal: new FormControl({ value: 0, disabled: true }),
      })
    );
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  updateItemTotal(index: number) {
    const group = this.items.at(index) as FormGroup;
    const qty = group.get('itemQty')?.value || 0;
    const price = group.get('itemPrice')?.value || 0;
    group.get('itemTotal')?.setValue(qty * price);
  }

  onSubmit(status: 'draft' | 'pending') {
    if (this.newInvoiceForm.invalid) return;

    const raw = this.newInvoiceForm.getRawValue();

    const invoice: Invoice = {
      id: Date.now().toString(),
      status,
      senderAddress: {
        street: raw.fromStreetAddress!,
        city: raw.fromCity!,
        postCode: raw.fromPostCode!,
        country: raw.fromCountry!,
      },
      clientName: raw.clientName!,
      clientEmail: raw.clientEmail!,
      clientAddress: {
        street: raw.toStreetAddress!!,
        city: raw.toCity!,
        postCode: raw.toPostCode!,
        country: raw.toCountry!,
      },
      createdAt: raw.date!,
      paymentTerms: +raw.paymentTerms!,
      description: raw.description!,
      items: raw.items.map((item) => ({
        name: item.itemName!,
        quantity: item.itemQty!,
        price: item.itemPrice!,
        total: item.itemQty! * item.itemPrice!,
      })),
      total: raw.items.reduce(
        (sum, item) => sum + item.itemQty! * item.itemPrice!,
        0
      ),
    };

    this.invoiceService.addInvoice(invoice);

    this.newInvoiceForm.reset();
    this.items.clear();
    this.addItem();

    alert(`Invoice saved as ${status}`);
  }

  onCancel() {
    this.newInvoiceForm.reset();
    this.items.clear();
    this.addItem();
  }
}
