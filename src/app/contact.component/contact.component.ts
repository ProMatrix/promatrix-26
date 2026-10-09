import { Component } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  readonly linkedInUrl = 'https://www.linkedin.com/company/promatrix-inc./home/';

  constructor(public appServices: AppServices) {
  }
}
