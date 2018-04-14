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
      this.nativeAudio.unload('alart')
      .catch((err) => console.log('[AudioProvider] nativeAudio.unload: ' + err))
      .then(() => this.nativeAudio.preloadComplex('alart', 'assets/audio/alart.mp3', 1, 1, 0))
      .then(() => this.audioLoaded = true)
      .catch((err) => console.log('[AudioProvider] nativeAudio.preloadComplex: ' + err));
    })
    .catch((err) => console.log(err));
  }

  ring(): void {
    if (this.audioLoaded) {
      this.nativeAudio.loop('alart').then().catch((err) => console.log('[AudioProvider] nativeAudio.loop: ' + err));
    }
  }

  stop(): void {
    if (this.audioLoaded) {
      this.nativeAudio.stop('alart').then().catch((err) => console.log('[AudioProvider] nativeAudio.stop: ' + err));
    }
  }
}
