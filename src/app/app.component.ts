import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      try {
        // Set status bar style
        await StatusBar.setStyle({ style: Style.Dark });
        
        // Set status bar background color (optional)
        await StatusBar.setBackgroundColor({ color: '#000000' });
        
        // Show status bar
        await StatusBar.show();
      } catch (error) {
        console.error('Error configuring status bar:', error);
      }
    });
  }
}
