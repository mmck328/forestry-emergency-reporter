import { Injectable } from '@angular/core';
import { Platform, Events, AlertController } from 'ionic-angular';
import { MotionProvider } from '../motion/motion';
import { AudioProvider } from '../audio/audio';
import { CommunicationProvider } from '../communication/communication';

/*
  Generated class for the StateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
enum State {
  Normal,
  Alerting,
  Reporting
}

@Injectable()
export class StateProvider {
  state: State = State.Normal;

  constructor(public platform: Platform, public events: Events, private alertCtrl: AlertController, private motionProvider: MotionProvider, private audioProvider: AudioProvider, private comProvider: CommunicationProvider) {
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
    this.comProvider.sendState();
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
