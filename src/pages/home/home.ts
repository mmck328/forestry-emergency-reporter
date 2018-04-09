import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  acceleration: DeviceMotionAccelerationData;
  vector: number;
  moved: boolean;
  subscription: any;
  constructor(public navCtrl: NavController, public platform: Platform, private deviceMotion: DeviceMotion) {
    this.acceleration = {x: 0, y: 0, z: 0, timestamp: null};
    this.vector = 9.8;
    this.moved = false;
    
    this.platform.ready().then((readySource) => {
      this.subscription = this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.acceleration = acceleration;
        this.vector = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z);
        this.moved = this.vector < 9.4 || 10.2 < this.vector;
      });
    })
  };
}
