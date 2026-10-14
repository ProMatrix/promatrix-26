import { Injectable } from '@angular/core';

// const translations: IAppTranslations = require('./translations.json');

@Injectable({ providedIn: 'root' })
export class AppServices {

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

}
