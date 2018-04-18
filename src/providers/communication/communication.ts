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
  private receivedCharacteristicId: string = '7F5D2112-0B9F-4188-9C4D-6AC4C161EC81';
  private sendCharacteristicId: string = '3D161CC8-CFE4-4948-B582-672386BB41AB';
  private gw: any;
  private interval: any;
  public received: string = '';
  public connected: boolean = false;
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
        this.received = dec.decode(new Uint8Array(newValue));
        console.log(this.received)
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
