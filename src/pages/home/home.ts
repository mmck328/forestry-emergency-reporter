import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { MotionProvider } from '../../providers/motion/motion';
import { AudioProvider } from '../../providers/audio/audio';
import { GeolocationProvider } from '../../providers/geolocation/geolocation'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  alarting: boolean;
  constructor(public navCtrl: NavController, public platform: Platform, public events: Events, private motionProvider: MotionProvider, private audioProvider: AudioProvider, private geolocationProvider: GeolocationProvider) {
    this.events.subscribe('motion:updated', () => this.onMotionUpdated())
  };

  onMotionUpdated(): void {
    if (!this.alarting && this.motionProvider.steadyDuration > 10000) {
      this.audioProvider.ring();
      this.alarting = true;
    } 
    if (this.alarting && this.motionProvider.steadyDuration <= 10000) {
      this.audioProvider.stop();
      this.alarting = false;
    }
  }
}
