
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarService } from '../services/car.service';
import { UiService, Language } from '../services/ui.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, MatIconModule],
  template: `
    <nav class="fixed top-0 z-50 w-full transition-all duration-300 bg-slate-900/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20 md:h-24">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center cursor-pointer group" routerLink="/">
            @if(config().logoUrl) {
                <img [src]="config().logoUrl" alt="Alperler Rent A Car Logo" class="h-10 md:h-12 object-contain mr-3 md:mr-4">
            } @else {
                <div class="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-sm flex items-center justify-center mr-3 md:mr-4 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:bg-white transition-all duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 md:w-8 md:h-8 text-slate-900 group-hover:text-amber-500 transition-colors">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div class="flex flex-col justify-center">
                  <span class="font-serif font-bold text-xl md:text-2xl text-white tracking-tight leading-none group-hover:text-amber-500 transition-colors">ALPERLER</span>
                  <span class="text-[0.5rem] md:text-[0.6rem] text-slate-400 font-bold tracking-[0.35em] uppercase mt-1 text-justify w-full">Rent A Car</span>
                </div>
            }
          </div>

          <!-- Desktop Menu -->
          <div class="hidden lg:flex items-center space-x-6">
            <!-- Search Bar -->
            <div class="relative group mr-4">
              <div class="flex items-center bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 focus-within:border-amber-500 focus-within:bg-slate-800 transition-all w-48 focus-within:w-64">
                <mat-icon class="text-slate-400 text-sm mr-2">search</mat-icon>
                <input 
                  type="text" 
                  [placeholder]="t().common.searchPlaceholder || 'İlan No veya Model...'" 
                  class="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                  (keyup.enter)="onGlobalSearch($event)"
                >
              </div>
            </div>

            <a routerLink="/" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" [routerLinkActiveOptions]="{exact: true}" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.home }}</a>
            <a routerLink="/fleet" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.fleet }}</a>
            <a routerLink="/sales" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-amber-400 hover:text-amber-200 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 py-2 flex items-center">
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1 animate-pulse"></span>
              {{ t().nav.sales }}
            </a>
            <a routerLink="/list-your-car" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-amber-500 hover:text-amber-400 font-bold text-[10px] uppercase tracking-widest transition-all duration-300 py-2">
              {{ t().nav.earn }}
            </a>
            <a routerLink="/tours" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.tours }}</a>
            <a routerLink="/blog" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.blog }}</a>
            <a routerLink="/about" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.about }}</a>
            <a routerLink="/legal" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.corporate }}</a>
            <a routerLink="/contact" (click)="uiService.closeAllOverlays()" routerLinkActive="text-amber-500 border-b-2 border-amber-500" class="text-slate-300 hover:text-white font-medium text-[10px] uppercase tracking-widest transition-all duration-300 py-2">{{ t().nav.contact }}</a>
          </div>

          <!-- Right Side Icons -->
          <div class="hidden lg:flex items-center space-x-4">
             
             <!-- Language Switcher -->
             <div class="relative group">
               <button class="flex items-center text-xs font-bold text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded transition-colors uppercase" aria-label="Dil Seçimi">
                    {{ uiService.currentLang() }}
                    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
               </button>
               <!-- Dropdown -->
               <div class="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div class="py-1">
                    @for (lang of languages; track lang) {
                      <button (click)="setLang(lang)" class="block w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" [class.text-amber-500]="uiService.currentLang() === lang">
                        {{ langName(lang) }}
                      </button>
                    }
                  </div>
               </div>
             </div>

             <!-- Fav Icon -->
             <button 
               class="relative group p-2 rounded-full hover:bg-slate-800 transition-colors" 
               [attr.aria-label]="t().common.favorites || 'Favoriler'" 
               routerLink="/fleet" 
               [queryParams]="{favs: 'true'}"
             >
                <mat-icon class="text-slate-300 group-hover:text-amber-500 transition-colors">star_border</mat-icon>
                @if (favCount() > 0) {
                  <span class="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{{ favCount() }}</span>
                }
             </button>

             <a routerLink="/appointment" [attr.aria-label]="t().buttons.appointment" class="bg-white hover:bg-amber-500 text-slate-900 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg border border-transparent hover:border-amber-600 hover:shadow-amber-500/20 ml-2">
              {{ t().buttons.appointment }}
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <div class="lg:hidden flex items-center gap-4">
            <!-- Mobile Language Switcher (Simple Cycle) -->
            <div class="relative">
               <button (click)="toggleLangMenu()" class="flex items-center text-xs font-bold text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded uppercase">
                   {{ uiService.currentLang() }}
               </button>
               @if (isLangMenuOpen()) {
                 <div class="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded shadow-xl z-50">
                    @for (lang of languages; track lang) {
                      <button (click)="setLang(lang); toggleLangMenu()" class="block w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" [class.text-amber-500]="uiService.currentLang() === lang">
                        {{ langName(lang) }}
                      </button>
                    }
                 </div>
               }
            </div>

            <!-- Mobile Fav Icon -->
            <button 
              class="relative group p-2 rounded-full hover:bg-slate-800 transition-colors" 
              routerLink="/fleet" 
              [queryParams]="{favs: 'true'}"
              [attr.aria-label]="t().common.favorites || 'Favoriler'"
            >
                <mat-icon class="text-slate-300">star_border</mat-icon>
                @if (favCount() > 0) {
                  <span class="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold w-3 h-3 flex items-center justify-center rounded-full">{{ favCount() }}</span>
                }
            </button>

            <button (click)="toggleMenu()" aria-label="Menüyü Aç/Kapat" class="text-white hover:text-amber-500 focus:outline-none p-2 transition-colors">
              <svg class="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                @if (!isMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (isMenuOpen()) {
        <div class="lg:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10 absolute w-full shadow-2xl z-40 h-[calc(100vh-80px)] animate-fade-in-down overflow-y-auto">
          <div class="px-6 py-8 space-y-4 flex flex-col items-center text-center">
            <!-- Mobile Search -->
            <div class="w-full mb-6">
              <div class="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-amber-500 transition-all">
                <mat-icon class="text-slate-400 mr-2">search</mat-icon>
                <input 
                  type="text" 
                  [placeholder]="t().common.searchPlaceholder || 'İlan No veya Model...'" 
                  class="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
                  (keyup.enter)="onGlobalSearch($event); closeMenu()"
                >
              </div>
            </div>

            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.home }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/fleet" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.fleet }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/sales" class="text-xl font-serif text-amber-500 font-bold py-2 w-full border-b border-white/5">{{ t().nav.sales }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/list-your-car" class="text-xl font-serif text-amber-500 font-bold py-2 w-full border-b border-white/5">{{ t().nav.earn }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/tours" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.tours }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/blog" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.blog }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/about" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.about }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/legal" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.corporate }}</a>
            <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/contact" class="text-xl font-serif text-slate-300 hover:text-amber-500 py-2 w-full border-b border-white/5">{{ t().nav.contact }}</a>
            
            <div class="mt-4 w-full space-y-3">
                <a (click)="closeMenu(); uiService.closeAllOverlays()" routerLink="/appointment" class="block w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-lg shadow-lg text-lg uppercase tracking-widest">
                    {{ t().buttons.appointment }}
                </a>
            </div>
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  carService = inject(CarService);
  uiService = inject(UiService);
  router = inject(Router);
  config = this.carService.getConfig();
  isMenuOpen = signal(false);
  isLangMenuOpen = signal(false);
  
  favCount = this.carService.getFavoriteCount;
  t = this.uiService.translations;

  languages: Language[] = ['TR', 'EN', 'DE', 'FR', 'ES', 'RU', 'ZH', 'AR'];

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  openAbout() {
    this.uiService.toggleAbout(true);
  }

  openContact() {
    this.uiService.toggleContact(true);
  }

  setLang(lang: Language) {
    this.uiService.setLanguage(lang);
  }

  toggleLangMenu() {
    this.isLangMenuOpen.update(v => !v);
  }
  
  onGlobalSearch(event: any) {
    const query = event.target.value.trim();
    if (!query) return;

    // Check if it's an Ad ID (numeric and long enough)
    const vehicle = this.carService.getVehicleByAdId(query);
    if (vehicle) {
      const type = vehicle.category === 'SALE' ? 'sales' : 'fleet';
      this.router.navigate([`/${type}`, vehicle.id]);
      event.target.value = '';
      return;
    }

    // Otherwise, navigate to fleet or sales with search query
    this.router.navigate(['/fleet'], { queryParams: { search: query } });
    event.target.value = '';
  }

  langName(lang: Language): string {
    const names: Record<Language, string> = {
      TR: 'Türkçe',
      EN: 'English',
      DE: 'Deutsch',
      FR: 'Français',
      ES: 'Español',
      RU: 'Русский',
      ZH: '中文',
      AR: 'العربية'
    };
    return names[lang];
  }
}
