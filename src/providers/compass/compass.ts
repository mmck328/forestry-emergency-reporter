import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

/*
  Generated class for the CompassProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CompassProvider {
  private r = 6378.137 
  public magneticHeading = 0
  private subscription = null

  constructor(public http: HttpClient,private deviceOrientation: DeviceOrientation) {
    console.log('Hello CompassProvider Provider');
    this.subscription = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        console.log(data);
        this.magneticHeading = data.magneticHeading
      }
    );
  }

  public getCompass(){
    // this.deviceOrientation.getCurrentHeading().then(
    //   (data: DeviceOrientationCompassHeading) => {
    //     console.log(data)
    //     this.magneticHeading = data.magneticHeading
    //   },
    //   (error: any) => {
    //     console.log(error)
    //   }
    // )
  }

  private calc(here, dest){
    let x1 = this.radians(here['lat'])
    let y1 = this.radians(here['lng'])
    let x2 = this.radians(dest['lat'])
    let y2 = this.radians(dest['lng'])

    let deltax = x2 - x1
    
    let degree = this.degrees(Math.atan2(Math.sin(deltax),(Math.cos(y1)*Math.tan(y2)-Math.sin(y1)*Math.cos(deltax))))%360  //度
    let distance = this.r *Math.acos(Math.sin(y1)*Math.sin(y2)+Math.cos(y1)*Math.cos(y2)*Math.cos(deltax)) * 1000 //m

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
