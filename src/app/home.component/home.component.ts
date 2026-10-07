import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);

  showTopTitle = false;
  showWelcomeText = false;
  showMiddleTitle = false;
  showBottomTitle = false;  
  showMoreInfoText = false;

  constructor(public appServices: AppServices, private readonly changeDetectorRef: ChangeDetectorRef) {
    // appServices.loadTranslatedPage('home');
   }

  private updateView(update: () => void) {
    if (this.destroyRef.destroyed) {
      return;
    }

    update();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    setTimeout(()=> {
      this.updateView(() => { this.showTopTitle = true; });
      setTimeout(()=> {
        this.updateView(() => { this.showWelcomeText = true; });
        setTimeout(()=> {
          this.updateView(() => { this.showMiddleTitle = true; });
          setTimeout(()=> {
            this.updateView(() => { this.showBottomTitle = true; });
            setTimeout(()=> {
              this.updateView(() => { this.showMoreInfoText = true; });
            }, 250);
          }, 250);
        }, 250);
      }, 500);
    }, 1250);
   }

  get classByDisabled() {
    return 'mat-button-enabled';
  }

}

