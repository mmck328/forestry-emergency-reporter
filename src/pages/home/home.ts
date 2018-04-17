import { Component } from '@angular/core';
import { NavController, Platform, Events, AlertController } from 'ionic-angular';
import { MotionProvider } from '../../providers/motion/motion';
import { AudioProvider } from '../../providers/audio/audio';
import { GeolocationProvider } from '../../providers/geolocation/geolocation'
import { CommunicationProvider } from '../../providers/communication/communication';
import { StateProvider } from '../../providers/state/state'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private motionProvider: MotionProvider, private geolocationProvider: GeolocationProvider, private comProvider: CommunicationProvider, private stateProvider: StateProvider) {

  };

}
