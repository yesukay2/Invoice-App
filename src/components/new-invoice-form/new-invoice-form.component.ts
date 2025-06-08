import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceItem, RawItem } from '../../models/invoice.model';

@Component({
  selector: 'app-new-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-invoice-form.component.html',
  styleUrl: './new-invoice-form.component.scss',
})
export class NewInvoiceFormComponent implements OnInit {
  protected invoiceService = inject(InvoiceService);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);

  isEditMode = false;
  editingInvoiceId: string | null = null;

  newInvoiceForm = new FormGroup({
    fromStreetAddress: new FormControl('', Validators.required),
    fromCity: new FormControl('', Validators.required),
    fromPostCode: new FormControl('', Validators.required),
    fromCountry: new FormControl('', Validators.required),
    clientName: new FormControl('', Validators.required),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    toStreetAddress: new FormControl('', Validators.required),
    toCity: new FormControl('', Validators.required),
    toPostCode: new FormControl('', Validators.required),
    toCountry: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    paymentTerms: new FormControl('7'),
    description: new FormControl('', Validators.required),
    items: new FormArray([]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editingInvoiceId = id;
      this.invoiceService.getInvoiceById(id).subscribe((invoice) => {
        if (invoice) {
          this.populateForm(invoice);
        } else {
          console.error('Invoice not found');
        }
      });
    } else {
      this.addItem(); // Add initial empty item
    }
  }
  // Add to NewInvoiceFormComponent class
  getFormTitle(): string {
    return ''; // Default empty for new invoice
  }

  get items(): FormArray {
    return this.newInvoiceForm.get('items') as FormArray;
  }

  addItem(item?: any) {
    this.items.push(
      new FormGroup({
        itemName: new FormControl(item?.itemName || '', Validators.required),
        itemQty: new FormControl(item?.itemQty || 1, [
          Validators.required,
          Validators.min(1),
        ]),
        itemPrice: new FormControl(item?.itemPrice || 0, [
          Validators.required,
          Validators.min(0),
        ]),
        itemTotal: new FormControl({
          value: item?.itemTotal || 0,
          disabled: true,
        }),
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

  populateForm(invoice: Invoice) {
    while (this.items.length) {
      this.items.removeAt(0);
    }

    this.newInvoiceForm.patchValue({
      fromStreetAddress: invoice.senderAddress.street,
      fromCity: invoice.senderAddress.city,
      fromPostCode: invoice.senderAddress.postCode,
      fromCountry: invoice.senderAddress.country,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      toStreetAddress: invoice.clientAddress.street,
      toCity: invoice.clientAddress.city,
      toPostCode: invoice.clientAddress.postCode,
      toCountry: invoice.clientAddress.country,
      date: invoice.createdAt,
      paymentTerms: invoice.paymentTerms.toString(),
      description: invoice.description,
    });

    invoice.items.forEach((item) => {
      this.addItem({
        itemName: item.name,
        itemQty: item.quantity,
        itemPrice: item.price,
        itemTotal: item.total,
      });
    });
  }

  // Update onSubmit in new-invoice-form.component.ts
  onSubmit(status: 'draft' | 'pending') {
    if (this.newInvoiceForm.invalid) {
      this.newInvoiceForm.markAllAsTouched();
      return;
    }

    const raw = this.newInvoiceForm.getRawValue();
    const currentStatus =
      this.isEditMode && this.editingInvoiceId
        ? (this.invoiceService.getCurrentStatus(this.editingInvoiceId) as
            | 'draft'
            | 'pending'
            | 'paid')
        : status;

    const invoice: Invoice = {
      id: this.editingInvoiceId || Date.now().toString(),
      status: currentStatus || status,
      senderAddress: {
        street: raw.fromStreetAddress!,
        city: raw.fromCity!,
        postCode: raw.fromPostCode!,
        country: raw.fromCountry!,
      },
      clientName: raw.clientName!,
      clientEmail: raw.clientEmail!,
      clientAddress: {
        street: raw.toStreetAddress!,
        city: raw.toCity!,
        postCode: raw.toPostCode!,
        country: raw.toCountry!,
      },
      createdAt: raw.date!,
      paymentTerms: +raw.paymentTerms!,
      description: raw.description!,
      items: raw.items.map((item: RawItem) => ({
        name: item.itemName,
        quantity: item.itemQty!,
        price: item.itemPrice!,
        total: item.itemQty! * item.itemPrice!,
      })),
      total: raw.items.reduce(
        (sum, item: RawItem) => sum + item.itemQty! * item.itemPrice!,
        0
      ),
    };

    if (this.isEditMode) {
      this.invoiceService.updateInvoice(invoice);
    } else {
      this.invoiceService.addInvoice(invoice);
    }

    this.router.navigate(['/invoices']);
  }
  onCancel() {
    this.newInvoiceForm.reset();
    this.items.clear();
    this.addItem();
    this.router.navigate(['/']);
  }
}
