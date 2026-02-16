import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { mergeWith } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppServices } from '../app.services';

interface ISmsMessage {
  emailAddress: string;
  message: string;
  privateKey: number;
}

interface IResponseMessage {
  status: string;
  timeAndDate: string;
  machineName: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactFormControl = new FormControl('', [Validators.required, Validators.email ]);
  messageFormControl = new FormControl('', [Validators.required]);
  _contactBy = 'Email';

  smsSendComplete = false;
  httpError = false;

  constructor(public appServices: AppServices, private cdr: ChangeDetectorRef, private httpClient: HttpClient) {
    appServices.loadTranslatedPage('contact');
  }

  get contactBy() : string {
    return this._contactBy;
  }

  set contactBy(contactBy: string) {
    if(contactBy === 'Email') {
      this.contactFormControl = new FormControl('', [Validators.required, Validators.email]);
    } else {
      const phoneRegex = '^([+-]{0,1}[ ]{0,1}[(]{0,1}[0-9]{1,4}[)]{0,1}[ ]{0,1}){0,4}$';
      this.contactFormControl = new FormControl('', [Validators.required, Validators.pattern(phoneRegex)]);
    }
    this._contactBy = contactBy;
  }

  get contactLabel(): string {
    if(this.contactBy === 'Email') {
      return 'Email Address';      
    }
    return 'Phone Number'; 
  }

  get formInvalid(): boolean {
    if(!this.contactFormControl) {
      return false;
    }
    return this.httpError || this.contactFormControl.invalid || this.messageFormControl.invalid;
  }

  get classByDisabled() {
    if (this.formInvalid) {
      return 'mat-button-disabled';
    }
    return 'mat-button-enabled';
  }

  onclickSubmit() {
    const privateKey = new Date().getTime();
    if(!this.contactFormControl.value || !this.messageFormControl.value) {
      return;
    }
    const postObject: ISmsMessage = { emailAddress: this.contactFormControl.value, message: this.messageFormControl.value, privateKey }
    this.sendSms(postObject, ()=> {

      this.smsSendComplete = true;
      this.httpError = false;   
         this.cdr.detectChanges();
    }, (e: HttpErrorResponse)=> {
      this.httpError = true;
      this.smsSendComplete = true;      
      this.cdr.detectChanges();
    });
  }
  
  sendSms(postObject: ISmsMessage, success: Function, failed: Function) {
    const subscription = this.httpClient.post(environment.postSendSms, postObject).pipe(mergeWith()).subscribe({
      next: (responseMessage: IResponseMessage | any) => {
        success(responseMessage);
      },
      error: (e: HttpErrorResponse) => {
        subscription.unsubscribe();
        failed(e);
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
  }
}
