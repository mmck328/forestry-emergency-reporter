import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion'
/*
  Generated class for the MotionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MotionProvider {
  private acceleration: DeviceMotionAccelerationData;
  private lastMoved: any;

  constructor(public platform: Platform, public events: Events, private deviceMotion: DeviceMotion) {
    this.acceleration = {x: 0, y: 0, z: 0, timestamp: 0};
    this.lastMoved = Number.MAX_VALUE;

    this.platform.ready().then((readySource) => {
      this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.acceleration = acceleration;
        if (this.moved) {
          this.lastMoved = this.acceleration.timestamp;
        }
        this.events.publish('motion:updated');
      });
    })
  };

  get magnitude(): number {
    return Math.sqrt(this.acceleration.x * this.acceleration.x + this.acceleration.y * this.acceleration.y + this.acceleration.z * this.acceleration.z);
  }

  get moved(): boolean {
    return this.magnitude < 9.5 || 10.1 < this.magnitude;
  }

  get steadyDuration(): number {
    return Math.max(this.acceleration.timestamp - this.lastMoved, 0);
  }

}
