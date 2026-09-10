import { Component } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent {

  constructor(public appServices: AppServices) {
    // appServices.loadTranslatedPage('settings');
  }

}