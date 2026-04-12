
import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './navbar.component';
import { FooterComponent } from './footer.component';
import { GeminiAdvisorComponent } from './gemini-advisor.component';
import { FeedbackComponent } from './feedback.component';
import { UiService } from '../services/ui.service';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, GeminiAdvisorComponent, FeedbackComponent, MatIconModule],
  template: `
    <div class="min-h-screen flex flex-col font-sans relative bg-slate-50">
      @if (isHomePage()) {
        <app-navbar></app-navbar>
      } @else {
        <!-- Standalone App Header for Subpages -->
        <div class="sticky top-0 z-[60] bg-[#005c8d] text-white px-4 h-14 flex items-center justify-between shadow-md">
           <button (click)="goBack()" aria-label="Geri Dön" class="px-3 py-1.5 -ml-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-white shrink-0">
             <mat-icon>arrow_back</mat-icon>
             <span class="text-sm font-medium">Geri</span>
           </button>
           <span class="font-bold text-sm uppercase tracking-wider truncate px-4">{{ getPageTitle() }}</span>
           <div class="w-16"></div> <!-- Spacer for centering -->
        </div>
      }
      
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      @if (isHomePage()) {
        <app-footer></app-footer>
      }
      
      <app-gemini-advisor></app-gemini-advisor>
      <app-feedback></app-feedback>

      <!-- Live Support Button (Only on Home Page) -->
      @if (isHomePage()) {
        <button 
          (click)="uiService.toggleContact(true)"
          class="fixed bottom-24 right-4 z-[60] w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] active:scale-90 transition-all hover:bg-blue-700 group"
          aria-label="Canlı Destek"
        >
          <mat-icon class="text-3xl group-hover:rotate-12 transition-transform">support_agent</mat-icon>
          <span class="absolute right-full mr-3 bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-blue-100">
            Canlı Destek
          </span>
        </button>
      }
    </div>
  `
})
export class MainLayoutComponent {
  uiService = inject(UiService);
  router = inject(Router);
  location = inject(Location);
  
  isHomePage = signal(true);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageState();
    });
    
    // Initial check
    this.updatePageState();
  }

  private updatePageState() {
    const url = this.router.url.split('?')[0];
    this.isHomePage.set(url === '/');
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getPageTitle(): string {
    const url = this.router.url.split('?')[0];
    if (url.startsWith('/fleet')) return 'Kiralık Araçlar';
    if (url.startsWith('/sales')) return 'Satılık Araçlar';
    if (url.startsWith('/blog')) return 'Blog & Haberler';
    if (url.startsWith('/tours')) return 'VIP Turlar';
    if (url.startsWith('/list-your-car')) return 'Arabanı Değerlendir';
    if (url.startsWith('/contact')) return 'İletişim';
    if (url.startsWith('/about')) return 'Hakkımızda';
    if (url.startsWith('/legal')) return 'Kurumsal';
    if (url.startsWith('/appointment')) return 'Randevu Talebi';
    if (url.startsWith('/faq')) return 'S.S.S.';
    return 'Alperler Rent A Car';
  }
}
