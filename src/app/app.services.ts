import { Injectable } from '@angular/core';

// const translations: IAppTranslations = require('./translations.json');

@Injectable({ providedIn: 'root' })
export class AppServices {

  constructor() {
    this.switchDarkMode(this.darkMode);
  }

  viewPort = '';
  private defaultLanguage = 'EN';
  get language() {
    const languageStored = localStorage.getItem('language');
    if (languageStored) {
      return languageStored;
    } else {
      return this.defaultLanguage;
    }
  }

  set language(value: string) {
    localStorage.setItem('language', value);
  }

  pageDisplayed = '';
  validPages = ['HOME', 'PROTOTYPES', 'SHOWCASE', 'ABOUT US', 'CONTACT'];
  defaultPage = 'HOME';
  get pageToDisplay() {
    const pageDisplayed = localStorage.getItem('pageDisplayed');
    if (pageDisplayed) {
      const c = this.validPages.find((page) => {
        return page === pageDisplayed;
      });
      if (c) {
        this.pageDisplayed = c;
      } else {
        this.pageDisplayed = this.defaultPage;
      }
    } else {
      this.pageDisplayed = this.defaultPage;
    }
    return this.pageDisplayed;
  }

  set pageToDisplay(pageDisplayed: string) {
    localStorage.setItem('pageDisplayed', pageDisplayed);
    this.pageDisplayed = pageDisplayed;
  }

  get darkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      if(darkMode === 'true') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  set darkMode(value: boolean) {
    localStorage.setItem('darkMode', value.toString());
    this.switchDarkMode(value);
  }

  switchDarkMode(darkMode: boolean){
    if(darkMode) {
      document.documentElement.classList.remove('mat-light-theme');
      document.documentElement.classList.remove('app-light-theme');
      document.documentElement.classList.add('mat-dark-theme');
      document.documentElement.classList.add('app-dark-theme');
    } else {
      document.documentElement.classList.remove('mat-dark-theme');
      document.documentElement.classList.remove('app-dark-theme');
      document.documentElement.classList.add('mat-light-theme');
      document.documentElement.classList.add('app-light-theme');
    }
  }

}
