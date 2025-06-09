import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemComponent } from './invoice-item.component';
import { TitlecasePipe } from '../../pipes/titlecase.pipe';

describe('InvoiceItemComponent', () => {
  let component: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceItemComponent, TitlecasePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
