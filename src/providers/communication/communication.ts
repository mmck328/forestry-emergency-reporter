import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

/*
  Generated class for the CommunicationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunicationProvider {
  private serviceId: string = '17CF6671-7A8C-4DDD-9547-4BFA6D3F1C49';
  private stringCharacteristicId: string = '2a3d';
  private gw: any;
  public received: string = '';
  constructor(public platform: Platform, private ble: BLE) {
    this.platform.ready().then(() => {
      this.scan();
    });
  }

  scan(): void {
    this.ble.startScan([this.serviceId]).subscribe(
      (device) => this.onDeviceDiscovered(device),
      (error) => console.log(error)
    );
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
        console.log('[CommunicationProvider] connected: ' + connect);
        this.onConnected();
      },
      (disconnect) => {
        console.log('[CommunicationProvider] disconnected: ' + disconnect);
        this.scan();
      });
  }

  onConnected(): void {
    this.ble.startNotification(this.gw.id, this.serviceId, this.stringCharacteristicId).subscribe(
      (newValue) => {
        let dec = new TextDecoder();
        this.received = dec.decode(new Uint8Array(newValue));
        console.log(this.received)
      },
      (error) => console.log(error)
    );
  }
}
