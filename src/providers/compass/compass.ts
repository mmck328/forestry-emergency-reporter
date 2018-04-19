import { Injectable } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';
import { GeolocationProvider } from '../geolocation/geolocation';
import { CommunicationProvider } from '../communication/communication';

/*
  Generated class for the CompassProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompassProvider {
  private r = 6378.137 
  public heading = 0
  private subscription = null
  constructor(private deviceOrientation: DeviceOrientation, private geolocProvider: GeolocationProvider, private commuProvider: CommunicationProvider) {
    console.log('Hello CompassProvider Provider');
    this.subscription = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        // console.log(data);
        this.heading = data.trueHeading;
      }
    );
  }

  public getCompass(){
    // this.deviceOrientation.getCurrentHeading().then(
    //   (data: DeviceOrientationCompassHeading) => {
    //     console.log(data)
    //     this.heading = data.magneticHeading
    //   },
    //   (error: any) => {
    //     console.log(error)
    //   }
    // )
  }

  get calc(): any {
    let x1 = this.radians(this.geolocProvider.location.latitude)
    let y1 = this.radians(this.geolocProvider.location.longitude)
    let x2 = this.radians(this.commuProvider.receivedLocation.latitude)
    let y2 = this.radians(this.commuProvider.receivedLocation.longitude)

    let deltax = x2 - x1
    
    let degree = (this.degrees(Math.atan2(Math.sin(deltax),(Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltax)))) + 360) % 360  // 度
    let distance = this.r * Math.acos(Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(deltax)) * 1000 // m

    let res = {
      degree: degree,
      distance: distance,
    }

    return res
  }

  private radians(v){
    return v * Math.PI / 180;
  }
  private degrees(v){
    return v * 180 / Math.PI;
  }
}
