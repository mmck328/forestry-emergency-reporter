import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Platform, Events, AlertController } from 'ionic-angular';
import { MotionProvider } from '../motion/motion';
import { AudioProvider } from '../audio/audio';
import { CommunicationProvider } from '../communication/communication';
import { GeolocationProvider } from '../geolocation/geolocation';
import { UserProvider } from '../user/user';

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
  public state: State = State.Normal;
  private interval: number = null;
  constructor(public platform: Platform, public events: Events, private alertCtrl: AlertController, private motionProvider: MotionProvider, private audioProvider: AudioProvider, private geolocProvider: GeolocationProvider, private comProvider: CommunicationProvider, private userProvider: UserProvider) {
    this.events.subscribe('motion:updated', () => this.onMotionUpdated());
    setTimeout(() => {
      this.interval = setInterval(() => this.sendInfo(), 60 * 1000);
    }, 60 * 1000 - Date.now() % (60 * 1000));
  };

  sendInfo(): void {
    let type = '0' // upstream
    let id = this.userProvider.username;
    let lat = new DecimalPipe('en-US').transform(this.geolocProvider.location.latitude, '2.5-5');
    if (lat.indexOf('-') < 0) {
      lat = '+' + lat
    }
    let lng = new DecimalPipe('en-US').transform(this.geolocProvider.location.longitude, '3.5-5');
    if (lng.indexOf('-') < 0) {
      lng = '+' + lng
    }
    let status = (this.state === State.Reporting ? '1' : '0');
    let timestamp = Date.now();
    let infoString = type + id + lat + lng + status + timestamp;
    console.log('sendInfo: ' + infoString);
    this.comProvider.send(infoString);
  }

  presentReportingAlert(): void {
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
    this.sendInfo();
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
