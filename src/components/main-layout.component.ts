
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { GeminiAdvisorComponent } from './gemini-advisor.component';
import { AboutComponent } from '../pages/about.component';
import { ContactComponent } from '../pages/contact.component';
import { LegalComponent } from '../pages/legal.component';
import { FeedbackComponent } from './feedback.component';
import { UiService } from '../services/ui.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, GeminiAdvisorComponent, AboutComponent, ContactComponent, LegalComponent, FeedbackComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans relative">
      <app-navbar></app-navbar>
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
      
      <app-gemini-advisor></app-gemini-advisor>

      <!-- OVERLAYS -->
      @if (uiService.isAboutOpen()) {
        <div class="fixed inset-0 z-[60] overflow-y-auto bg-white animate-fade-in">
           <app-about></app-about>
        </div>
      }

      @if (uiService.isContactOpen()) {
        <div class="fixed inset-0 z-[60] overflow-y-auto bg-white animate-fade-in">
           <app-contact></app-contact>
        </div>
      }

      @if (uiService.isLegalOpen()) {
        <div class="fixed inset-0 z-[60] overflow-y-auto bg-white animate-fade-in">
           <app-legal></app-legal>
        </div>
      }

      <app-feedback></app-feedback>
    </div>
  `
})
export class MainLayoutComponent {
  uiService = inject(UiService);
}
