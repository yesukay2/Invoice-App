import { Component, inject, HostListener, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-invoice-form',
  imports: [ReactiveFormsModule],
  templateUrl: './new-invoice-form.component.html',
  styleUrl: './new-invoice-form.component.scss',
})
export class NewInvoiceFormComponent {
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
    paymentTerms: new FormControl(''),
    description: new FormControl(''),
    itemName: new FormControl(''),
    itemQty: new FormControl(''),
    itemPrice: new FormControl(''),
  });

  private renderer = inject(Renderer2);
  @HostListener('window:scroll')
  onScroll() {
    const ctaContainer = document.getElementById('cta-container');
    if (ctaContainer) {
      if (window.scrollY > ctaContainer.offsetTop) {
        this.renderer.addClass(ctaContainer, 'cta-container-scroll');
      } else {
        this.renderer.removeClass(ctaContainer, 'cta-container-scroll');
      }
    }
  }
}
