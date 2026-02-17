import { Component } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor(public appServices: AppServices) {
    // appServices.loadTranslatedPage('about');
  }

}
