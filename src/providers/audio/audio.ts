import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

/*
  Generated class for the AudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AudioProvider {
  private audioLoaded: boolean;

  constructor(public platform: Platform, private nativeAudio: NativeAudio) {
    this.platform.ready()
    .then(() => {
      Promise.all([
        this.nativeAudio.unload('alert'), 
        this.nativeAudio.unload('report')
      ])
      .catch((err) => console.log('[AudioProvider] nativeAudio.unload: ' + err))
      .then(() => Promise.all([
        this.nativeAudio.preloadComplex('alert', 'assets/audio/alert.mp3', 1, 1, 0),
        this.nativeAudio.preloadComplex('report', 'assets/audio/report.aac', 1, 1, 0)
      ]))
      .then(() => this.audioLoaded = true)
      .catch((err) => console.log('[AudioProvider] nativeAudio.preloadComplex: ' + err));
    })
    .catch((err) => console.log(err));
  }

  loop(id: string): void {
    if (this.audioLoaded) {
      this.nativeAudio.loop(id).then().catch((err) => console.log('[AudioProvider] nativeAudio.loop: ' + err));
    }
  }

  stop(id: string): void {
    if (this.audioLoaded) {
      this.nativeAudio.stop(id).then().catch((err) => console.log('[AudioProvider] nativeAudio.stop: ' + err));
    }
  }
}
