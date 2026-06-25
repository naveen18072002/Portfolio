import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html'
})
export class AboutComponent {
  @Input() isActive = false;
}
