import { Component } from '@angular/core';
import { AppServices } from '../app.services';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {

  constructor(public appServices: AppServices) {
    appServices.loadTranslatedPage('footer');
  }

  get copyrightDetails() : string {
    const nowDate = new Date();
    const formattedCopyright = `Ⓒ Copyright ${nowDate.getFullYear()} ProMatrix Inc. Version: ${environment.appVersion} - Built for: ${environment.name}, language: ${this.appServices.language}`;
    return formattedCopyright;
  }
}