import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, Events, AlertController, Select } from 'ionic-angular';
import { MotionProvider } from '../../providers/motion/motion';
import { AudioProvider } from '../../providers/audio/audio';
import { GeolocationProvider } from '../../providers/geolocation/geolocation'
import { CommunicationProvider } from '../../providers/communication/communication';
import { StateProvider } from '../../providers/state/state';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('selectuser') select: Select;
  constructor(public navCtrl: NavController, private motionProvider: MotionProvider, private geolocProvider: GeolocationProvider, private comProvider: CommunicationProvider, private stateProvider: StateProvider, private userProvider: UserProvider, private events: Events) {
    this.events.subscribe('user:open-select', () => { this.select.open() });
  };
}
