import { Component } from '@angular/core';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private toast: ToastController) {
    this.initApp();
  }

  initApp() {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      if (!status.connected) {
        this.presentToast()
      }
    });
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: 'Your internet connection is lost.',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
