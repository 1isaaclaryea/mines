import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

// Register Syncfusion license
registerLicense(environment.syncfusionLicenseKey);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
