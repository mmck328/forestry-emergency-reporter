import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { UserProvider } from '../user/user';

/*
  Generated class for the CommunicationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunicationProvider {
  private serviceId: string = '17CF6671-7A8C-4DDD-9547-4BFA6D3F1C49';
  private receivedCharacteristicId: string = '7F5D2112-0B9F-4188-9C4D-6AC4C161EC81';
  private sendCharacteristicId: string = '3D161CC8-CFE4-4948-B582-672386BB41AB';
  private gw: any;
  private interval: any;
  public received: string = null;
  public connected: boolean = false;
  constructor(public platform: Platform, private ble: BLE, private localNotifications: LocalNotifications, private alertCtrl: AlertController, private userProvider: UserProvider) {
    this.platform.ready().then(() => {
      this.scan();
    });
  }

  get receivedLocation() {
    if (this.received) {
      let lat = Number('33.' + this.received.substr(4, 5));
      let lng = Number('133.' + this.received.substr(9, 5));
      return {latitude: lat, longitude: lng};
    } else {
      return null;
    }
  }

  get receivedMessage(): string {
    if (this.received) {
      return this.received.slice(14);
    } else {
      return null;
    }
  }

  scan(): void {
    this.ble.isEnabled()
    .then(() => {
      this.ble.startScan([this.serviceId]).subscribe(
        (device) => this.onDeviceDiscovered(device),
        (error) => console.log(error)
      );
    })
    .catch(() => {
      if (this.platform.is('android')) {
        this.alertCtrl.create({
          title: 'Bluetooth',
          message: 'Bluetoothを有効化してください。',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => { 
                this.ble.enable()
                .then(() => this.scan())
                .catch(() => this.scan())
              }
            }
          ]
        }).present();
      } else {
        this.alertCtrl.create({
          title: 'Bluetooth',
          message: 'Bluetoothを有効化してください。',
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler: () => { 
                setTimeout(() => this.scan(), 30 * 1000)
              }
            }
          ]
        }).present();     
      }
    })
  }

  onDeviceDiscovered(device): void {
    console.log('[CommunicationProvider] device discovered: ' + JSON.stringify(device));
    this.ble.stopScan().catch((err) => console.log('[CommunicationProvider] ble.stopScan: ' + err));
    this.gw = device;
    this.connect();
  }

  connect(): void {
    this.ble.connect(this.gw.id).subscribe(
      (connect) => {
        console.log('[CommunicationProvider] connected: ' + JSON.stringify(connect));
        this.onConnected();
      },
      (disconnect) => {
        console.log('[CommunicationProvider] disconnected: ' + JSON.stringify(disconnect));
        this.onDisconnected();
      });
  }

  send(value: string): void {
    let enc = new TextEncoder();
    if (this.connected) {
      this.ble.write(this.gw.id, this.serviceId, this.sendCharacteristicId, enc.encode(value).buffer)
      .catch((err) => {
        console.log('[CommunicationProvider] send failed: ' + err)
      });
    } else {
      console.log('[CommunicationProvider] send failed with no connection');
    }
  }

  onConnected(): void {
    this.connected = true;
    this.ble.startNotification(this.gw.id, this.serviceId, this.receivedCharacteristicId).subscribe(
      (newValue) => {
        let dec = new TextDecoder();
        let newString = dec.decode(new Uint8Array(newValue));
        if (newString.length >= 14 && newString.substr(1, 2) === this.userProvider.username) {
          this.received = newString;
          console.log('[CommunicationProvider] Received: ' + this.received);
          this.localNotifications.schedule({
            id: 1,
            text: 'メッセージを受信：' + this.received,
            data: { message: this.received }
          });  
        }   
      },
      (error) => console.log(error)
    );
  }

  onDisconnected(): void {
    this.connected = false;
    clearInterval(this.interval);
    this.scan();
  }
}
