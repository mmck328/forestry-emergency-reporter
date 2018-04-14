import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const config: BackgroundGeolocationConfig = {
  desiredAccuracy: 10,
  stationaryRadius: 20,
  distanceFilter: 30,
  debug: true,
  stopOnTerminate: false
};

@Injectable()
export class GeolocationProvider {
  location: BackgroundGeolocationResponse;
  constructor(public platform: Platform, private backgroundGeolocation: BackgroundGeolocation) {
    this.location = {locationId: 0, debug: true, time: 0, speed: 0, altitude: 0, altitudeAccuracy: 0, bearing: 0, coords: {accuracy: 0, altitude: 0, altitudeAccuracy: 0, heading: 0, latitude: 0, longitude: 0, speed: 0}, timestamp: 0, latitude: 0, longitude: 0, accuracy: 0, serviceProvider: ''};
    this.platform.ready().then((readySource) => {
      this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {
        this.location = location;
        console.log(JSON.stringify(location));
        this.backgroundGeolocation.finish().then().catch();
      });
      this.backgroundGeolocation.start();
    });
  }  
}
