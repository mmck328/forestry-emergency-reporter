import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  public username: string = '00';
  public users: Array<string> = ['01', '02', '03', '04', '05'];
  constructor(private nativeStorage: NativeStorage, private alertCtrl: AlertController, private events: Events) {
    this.nativeStorage.getItem('username')
    .then((result) => this.username = result)
    .catch((err) => {
      console.log('[UserProvider] Failed to get username from storage ' + err)
      this.alertCtrl.create({
        title: '初期設定',
        message: '作業者IDを設定してください',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'OK',
            handler: () => { this.events.publish('user:open-select') }
          }
        ]
      }).present();
    });
  }

  onChange(value: string) {
    console.log('[UserProvider] Username changed: ', value);
    this.username = value;
    this.nativeStorage.setItem('username', value)
    .then(() => {
      console.log('[UserProvider] Saved Username')
    })
    .catch(() => {
      console.log('[UserProvider] Failed to save Username')
    })
  }
}
