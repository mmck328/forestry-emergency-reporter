import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, Events, AlertController, Select } from 'ionic-angular';
import { MotionProvider } from '../../providers/motion/motion';
import { AudioProvider } from '../../providers/audio/audio';
import { GeolocationProvider } from '../../providers/geolocation/geolocation'
import { CommunicationProvider } from '../../providers/communication/communication';
import { StateProvider } from '../../providers/state/state';
import { UserProvider } from '../../providers/user/user';
import { CompassProvider } from '../../providers/compass/compass';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private showDescription = false;
  @ViewChild('selectuser') select: Select;
  constructor(public navCtrl: NavController, private motionProvider: MotionProvider, private geolocProvider: GeolocationProvider, private comProvider: CommunicationProvider, private stateProvider: StateProvider, private userProvider: UserProvider, private events: Events, private compassProvider: CompassProvider) {
    this.events.subscribe('user:open-select', () => { this.select.open() });
  };
  private toggleDescription(){
    this.showDescription = !this.showDescription;
  }
}
