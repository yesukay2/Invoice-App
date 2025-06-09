import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  invoiceId!: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.invoiceId = params['id'];
    });
  }

  title = 'Invoice-App';
}
