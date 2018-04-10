import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion'
import { NativeAudio } from '@ionic-native/native-audio'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  acceleration: DeviceMotionAccelerationData;
  subscription: any;
  lastMoved: any;
  alarting: boolean;
  audioLoaded: boolean;
  constructor(public navCtrl: NavController, public platform: Platform, private deviceMotion: DeviceMotion, private nativeAudio: NativeAudio) {
    this.acceleration = {x: 0, y: 0, z: 0, timestamp: 0};
    this.lastMoved = Number.MAX_VALUE;

    this.platform.ready().then((readySource) => {
      this.nativeAudio.preloadComplex('alart', 'assets/audio/alart.mp3', 1, 1, 0).then(() => this.audioLoaded = true).catch((err) => console.log(err))
      this.subscription = this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.acceleration = acceleration;
        if (this.moved) {
          this.lastMoved = this.acceleration.timestamp;
        }

        if (this.audioLoaded) {
          if (!this.alarting && this.steadyDuration > 10000) {
            this.nativeAudio.loop('alart').then().catch();
            this.alarting = true
            console.log('loop');
          } 
          if (this.alarting && this.steadyDuration <= 10000) {
            this.nativeAudio.stop('alart').then().catch();
            this.alarting = false;
            console.log('stop');
          }
        }
      });
    })
  };

  get vector(): number {
    return Math.sqrt(this.acceleration.x * this.acceleration.x + this.acceleration.y * this.acceleration.y + this.acceleration.z * this.acceleration.z);
  }

  get moved(): boolean {
    return this.vector < 9.5 || 10.1 < this.vector;
  }

  get steadyDuration(): number {
    return Math.max(this.acceleration.timestamp - this.lastMoved, 0);
  }

}
