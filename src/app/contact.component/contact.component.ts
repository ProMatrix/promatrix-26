import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AppServices } from '../app.services';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  readonly linkedInUrl = 'https://www.linkedin.com/company/promatrix-inc./home/';

  private readonly destroyRef = inject(DestroyRef);

  showLetsConnectTitle = false;
  showLetsConnectText = false;
  showReachOutText = false;
  showConnectButton = false;

  constructor(public appServices: AppServices, private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  private updateView(update: () => void) {
    if (this.destroyRef.destroyed) {
      return;
    }

    update();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    setTimeout(() => {
      this.updateView(() => { this.showLetsConnectTitle = true; });
      setTimeout(() => {
        this.updateView(() => { this.showLetsConnectText = true; });
        setTimeout(() => {
          this.updateView(() => { this.showReachOutText = true; });
          setTimeout(() => {
            this.updateView(() => { this.showConnectButton = true; });
          }, 250);
        }, 250);
      }, 500);
    }, 750);
  }
}
