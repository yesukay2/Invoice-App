// invoice-item.component.ts
import { Component, Input } from '@angular/core';
import { Invoice } from '../../utils/interfaces/invoice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-item.component.html',
  styleUrl: './invoice-item.component.scss',
})
export class InvoiceItemComponent {
  @Input({ required: true }) invoice!: Invoice; // Input property for the invoice data
}
