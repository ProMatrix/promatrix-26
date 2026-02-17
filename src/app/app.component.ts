import { Component, OnInit } from '@angular/core';
import { AppServices } from './app.services';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  environment: any;

  constructor(public appServices: AppServices) {
    this.environment = environment;
    // appServices.loadNavComponent();
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if(!pageParam) {
      return;
    }
    this.appServices.pageToDisplay = pageParam.toUpperCase();
  }

  getClassForHome() {
    if (this.appServices.pageToDisplay === 'HOME') {
      return 'home-link-selected';
    }
    return 'home-link-unselected';
  }

  getClassBySelection(navLink: string) {
    if (this.appServices.pageToDisplay === navLink) {
      return 'nav-link-selected';
    }
    return 'nav-link-unselected';
  }

 
}
