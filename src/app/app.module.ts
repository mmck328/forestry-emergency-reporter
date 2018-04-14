import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { DeviceMotion } from '@ionic-native/device-motion';
import { NativeAudio } from '@ionic-native/native-audio';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BLE } from '@ionic-native/ble'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MotionProvider } from '../providers/motion/motion';
import { AudioProvider } from '../providers/audio/audio';
import { GeolocationProvider } from '../providers/geolocation/geolocation';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DeviceMotion,
    NativeAudio,
    BackgroundGeolocation,
    BackgroundMode,
    BLE,
    MotionProvider,
    AudioProvider,
    GeolocationProvider
  ]
})
export class AppModule {}
