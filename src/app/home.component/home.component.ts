import { Component, OnInit } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showTopTitle = false;
  showWelcomeText = false;
  showMiddleTitle = false;
  showBottomTitle = false;  
  showMoreInfoText = false;
  showChatbotTitle = false;
  showChatbotInfoText = false;  
  showTalkShowCtrl = false;
  hostSoundwave = false;
  guestSoundwave = false;

  constructor(public appServices: AppServices) {
    // appServices.loadTranslatedPage('home');
   }

  ngOnInit() {
    setTimeout(()=> {
      this.showTopTitle = true;
      setTimeout(()=> {
        this.showWelcomeText = true;
        setTimeout(()=> {
          this.showMiddleTitle = true;
          setTimeout(()=> {
            this.showBottomTitle = true;
            setTimeout(()=> {
              this.showMoreInfoText = true;
              setTimeout(()=> {
                this.showTalkShowCtrl = true;
                this.chatMeUp();
                setTimeout(()=> {
                  this.showChatbotTitle = true;
                  setTimeout(()=> {
                    this.showChatbotInfoText = true;
                  }, 250);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 250);
      }, 500);
    }, 1250);
   }

   chatMeUp() {
    setTimeout(()=> {
      this.hostSoundwave = true;
      setTimeout(()=> {
        this.hostSoundwave = false;
        setTimeout(()=> {
          this.guestSoundwave = true;
          setTimeout(()=> {
            this.guestSoundwave = false;
            this.chatMeUp();
          }, this.randomDelay);
        }, 1000);
      }, this.randomDelay);
    }, 1000);

   }

  get classByDisabled() {
    return 'mat-button-enabled';
  }

  get randomDelay() {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    return (randomNumber / 3) * 1000;
  }

}

