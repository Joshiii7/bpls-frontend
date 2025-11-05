import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    setTimeout(() => {
      document.body.classList.add('app-ready');
    }, 800);
  })
  .catch(err => console.error(err));
