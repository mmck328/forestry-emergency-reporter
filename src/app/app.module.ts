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
import { NativeStorage } from '@ionic-native/native-storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { DeviceOrientation } from '@ionic-native/device-orientation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MotionProvider } from '../providers/motion/motion';
import { AudioProvider } from '../providers/audio/audio';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { CommunicationProvider } from '../providers/communication/communication';
import { StateProvider } from '../providers/state/state';
import { UserProvider } from '../providers/user/user';
import { CompassProvider } from '../providers/compass/compass';

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
    NativeStorage,
    LocalNotifications,
    DeviceOrientation,
    MotionProvider,
    AudioProvider,
    GeolocationProvider,
    CommunicationProvider,
    StateProvider,
    UserProvider,
    UserProvider,
    CompassProvider
  ]
})
export class AppModule {}
