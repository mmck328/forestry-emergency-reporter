import { Component } from '@angular/core';
import { NavController, Platform, Events, AlertController } from 'ionic-angular';
import { MotionProvider } from '../../providers/motion/motion';
import { AudioProvider } from '../../providers/audio/audio';
import { GeolocationProvider } from '../../providers/geolocation/geolocation'
import { CommunicationProvider } from '../../providers/communication/communication';

enum State {
  Normal,
  Alerting,
  Reporting
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  state: State;
  constructor(public navCtrl: NavController, public platform: Platform, public events: Events, private alertCtrl: AlertController, private motionProvider: MotionProvider, private audioProvider: AudioProvider, private geolocationProvider: GeolocationProvider, private communicationProvider: CommunicationProvider) {
    this.state = State.Normal;
    this.events.subscribe('motion:updated', () => this.onMotionUpdated());
  };

  presentReportingAlert() {
    this.alertCtrl.create({
      title: '通報中',
      message: '現在、事務所に救護要請しています。',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '取り消し',
          role: 'cancel',
          handler: () => this.stopReporting()
        }
      ]
    }).present();
  }

  startReporting(): void {
    this.audioProvider.stop('alert');
    this.audioProvider.loop('report');
    this.state = State.Reporting;
    this.presentReportingAlert();
  }

  stopReporting(): void {
    this.state = State.Normal;
    this.audioProvider.stop('report');
  }

  onMotionUpdated(): void {
    if (this.state == State.Alerting && this.motionProvider.steadyDuration > 20000) {
      this.startReporting();
    }
    if (this.state == State.Normal && this.motionProvider.steadyDuration > 10000) {
      this.audioProvider.loop('alert');
      this.state = State.Alerting;
    }
    if (this.state == State.Alerting && this.motionProvider.steadyDuration <= 10000) {
      this.audioProvider.stop('alert');
      this.state = State.Normal;
    }
  }
}
