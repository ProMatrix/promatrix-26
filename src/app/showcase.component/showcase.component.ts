import { Component } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})


export class ShowcaseComponent {

  constructor(public appServices: AppServices) {
    appServices.loadTranslatedPage('showcase');
  }
}