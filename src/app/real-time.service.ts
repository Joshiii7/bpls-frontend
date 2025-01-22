import { Injectable } from '@angular/core';
import * as Pusher from 'pusher-js';
import Echo from 'laravel-echo';
declare let window: any;


@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  private echo: Echo<any>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'da82fba2cc80842b6477', 
      cluster: 'ap1',
      encrypted: true,
    });

    this.listenForUpdates();
  }

  listenForUpdates() {
    this.echo.channel('data-updates')
      .listen('DataUpdated', (event: any) => {
        console.log('Data updated:', event);
      });
  }
}
