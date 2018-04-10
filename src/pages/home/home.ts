import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  acceleration: DeviceMotionAccelerationData;
  subscription: any;
  lastMoved: any;
  constructor(public navCtrl: NavController, public platform: Platform, private deviceMotion: DeviceMotion) {
    this.acceleration = {x: 0, y: 0, z: 0, timestamp: 0};
    this.lastMoved = Number.MAX_VALUE;
    
    this.platform.ready().then((readySource) => {
      this.subscription = this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.acceleration = acceleration;
        if (this.moved) {
          this.lastMoved = this.acceleration.timestamp;
        }
      });
    })
  };

  get vector(): number {
    return Math.sqrt(this.acceleration.x * this.acceleration.x + this.acceleration.y * this.acceleration.y + this.acceleration.z * this.acceleration.z);
  }

  get moved(): boolean {
    return this.vector < 9.4 || 10.2 < this.vector;
  }

  get steadyDuration(): number {
    return Math.max(this.acceleration.timestamp - this.lastMoved, 0);
  }

}
