import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
}
