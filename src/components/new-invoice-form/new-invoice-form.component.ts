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
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-new-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './new-invoice-form.component.html',
  styleUrl: './new-invoice-form.component.scss',
})
export class NewInvoiceFormComponent implements OnInit {
  protected invoiceService = inject(InvoiceService);
  private route = inject(ActivatedRoute);
  protected router = inject(Router);

  isEditMode = false;
  editingInvoiceId: string | null = null;
  showPaymentTerm = false;

  paymentTerms = [
    { id: 1, label: 'Net 1 Day' },
    { id: 7, label: 'Net 7 Days' },
    { id: 14, label: 'Net 14 Days' },
    { id: 30, label: 'Net 30 Days' },
  ];

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
    paymentTerms: new FormControl(7), // Default to Net 7 Days
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

  get paymentTermsControl(): FormControl {
    return this.newInvoiceForm.get('paymentTerms') as FormControl;
  }

  toggleShowTerm() {
    this.showPaymentTerm = !this.showPaymentTerm;
  }

  setSelectedTerm(termId: number) {
    this.paymentTermsControl.setValue(termId);
    this.showPaymentTerm = false;
  }

  getSelectedTermLabel(): string {
    const termId = this.paymentTermsControl.value;
    const term = this.paymentTerms.find((t) => t.id === termId);
    return term ? term.label : 'Select Payment Term';
  }

  getFormTitle(): string {
    return this.isEditMode ? `Edit #${this.editingInvoiceId}` : 'New Invoice';
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
      paymentTerms: invoice.paymentTerms,
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

  onSubmit(status: 'draft' | 'pending') {
    if (this.newInvoiceForm.invalid && status !== 'draft') {
      this.newInvoiceForm.markAllAsTouched();
      return;
    }

    const raw = this.newInvoiceForm.getRawValue();
    // const currentStatus =
    //   this.isEditMode && this.editingInvoiceId
    //     ? (this.invoiceService.getCurrentStatus(this.editingInvoiceId) as
    //         | 'draft'
    //         | 'pending'
    //         | 'paid')
    //     : status;

    const currentStatus = status;

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

    this.goBack();
  }

  onCancel() {
    this.newInvoiceForm.reset();
    this.items.clear();
    this.router.navigate([{ outlets: { modal: null } }], {
      relativeTo: this.route.parent,
    });
  }

  goBack() {
    this.router.navigate([{ outlets: { modal: null } }], {
      relativeTo: this.route.parent,
    });
  }
}
