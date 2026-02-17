import { Injectable } from '@angular/core';
import {
  appTranslations,
  IAppTranslations,
  IPage,
  page,
  IPageControl,
  pageControl,
} from 'C:/ProMatrix.2/anima-to-angular/frame/src/controlModel';

// const translations: IAppTranslations = require('./translations.json');

@Injectable({ providedIn: 'root' })
export class AppServices {

  constructor() {
    this.switchDarkMode(this.darkMode);
  }

  // getControlTranslation(control: IPageControl, label: string): string {
  //   if (control.words && control.words.length > 0) {
  //     const translation = control.words.find((x) => {
  //       return x.language === this.language;
  //     })?.value;

  //     if (!translation) {
  //       return '';
  //     }
  //     return translation;
  //   }

  //   if (control.childControls && control.childControls.length > 0) {
  //     const word = control.childControls.find((x) => {
  //       return x.label === label;
  //     });

  //     if (!word) {
  //       return '';
  //     }

  //     const translation = word.words.find((x) => {
  //       return x.language === this.language;
  //     })?.value;

  //     if (!translation) {
  //       return '';
  //     }
  //     return translation;
  //   }
  //   return 'What?';
  // }

  // navTranslatedPage: IPage | undefined;
  // getNavTranslation(className: string, label: string): string {
  //   if (!this.navTranslatedPage) {
  //     return '';
  //   }

  //   const control = this.navTranslatedPage.pageControls.find((x) => {
  //     return x.className === className;
  //   });
  //   if (!control) {
  //     return '';
  //   }
  //   return this.getControlTranslation(control, label);
  // }

  // translatedPage: IPage | undefined;
  // getTranslationByLabel(className: string, label: string): string {
  //   if (!this.translatedPage) {
  //     return '';
  //   }

  //   const control = this.translatedPage.pageControls.find((x) => {
  //     return x.className === className;
  //   });

  //   if (!control) {
  //     return '';
  //   }
  //   return this.getControlTranslation(control, label);
  // }

  // getTranslation(className: string): string {
  //   if (!this.translatedPage) {
  //     return 'What?';
  //   }

  //   const control = this.translatedPage.pageControls.find((x) => {
  //     return x.className === className;
  //   });

  //   if (!control) {
  //     return 'What?';
  //   }

  //   const translation = control.words.find((x) => {
  //     return x.language === this.language;
  //   })?.value;
  //   if (translation) {
  //     return translation;
  //   } else {
  //     return 'What?';
  //   }
  // }

  // rationaleInsert(className: string) {
  //   const nodeToUpdate = document.querySelector('.' + className);

  //   if (nodeToUpdate) {
  //     const bp = 0;
  //     nodeToUpdate.innerHTML = this.getTranslation(className);
  //   }
  // }

  // loadTranslatedPage(pageName: string) {
  //   const page = translations.pages.find((x) => {
  //     return x.pageName === pageName;
  //   });

  //   this.translatedPage = page;
  // }

  // loadNavComponent() {
  //   const page = translations.pages.find((x) => {
  //     return x.pageName === 'app';
  //   });
  //   this.navTranslatedPage = page;
  // }

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
