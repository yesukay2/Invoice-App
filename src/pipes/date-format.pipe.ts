import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'invoiceDate',
  standalone: true,
})
export class InvoiceDatePipe implements PipeTransform {
  transform(value: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd MMM yyyy') || '';
  }
}
