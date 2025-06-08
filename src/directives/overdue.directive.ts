// overdue.directive.ts
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appOverdue]',
  standalone: true,
})
export class OverdueDirective implements OnInit {
  @Input() createdAt!: string; // Invoice creation date
  @Input() paymentTerms!: number; // Selected terms (1,7,14,30)
  @Input() status!: string; // Invoice status

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.status !== 'paid') {
      const dueDate = new Date(this.createdAt);
      dueDate.setDate(dueDate.getDate() + this.paymentTerms);

      const today = new Date();
      if (dueDate < today) {
        this.el.nativeElement.style.borderLeft = '4px solid #ff0000';
      }
    }
  }
}
