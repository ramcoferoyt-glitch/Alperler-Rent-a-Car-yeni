
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';
import { APP_BASE_HREF } from '@angular/common';

// AI Studio önizleme ekranında (iframe) sayfa yenilendiğinde her zaman ana sayfadan başlaması için:
if (window.self !== window.top) {
  window.location.hash = '';
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    { provide: APP_BASE_HREF, useValue: '/' },
    provideRouter(
      routes, 
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    )
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
