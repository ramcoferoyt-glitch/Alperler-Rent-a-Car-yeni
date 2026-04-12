
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarService } from '../../services/car.service';
import { ToastComponent } from '../../components/toast.component';
import { ConfirmModalComponent } from '../../components/confirm-modal.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, ConfirmModalComponent],
  template: `
    <app-toast></app-toast>
    <app-confirm-modal></app-confirm-modal>
    <div class="flex min-h-screen bg-slate-100 font-sans relative">
      
      <!-- Mobile Header -->
      <div class="md:hidden fixed top-0 w-full bg-slate-900 text-white z-30 px-4 py-3 flex justify-between items-center shadow-md">
         <div class="flex items-center">
            @if(config().logoUrl) {
                <img [src]="config().logoUrl" alt="Logo" class="h-8 object-contain mr-2">
            }
            <span class="font-serif font-bold text-lg">ALPERLER <span class="text-amber-500">Admin</span></span>
         </div>
         <button (click)="toggleSidebar()" class="text-white focus:outline-none">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
         </button>
      </div>

      <!-- Sidebar Overlay for Mobile -->
      @if (isSidebarOpen()) {
        <div (click)="toggleSidebar()" class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"></div>
      }

      <!-- Sidebar -->
      <aside [class]="isSidebarOpen() ? 'translate-x-0' : '-translate-x-full md:translate-x-0'" class="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40 shadow-2xl transition-transform duration-300 pt-16 md:pt-0">
        <div class="hidden md:flex p-6 border-b border-white/10 items-center justify-center flex-col">
           @if(config().logoUrl) {
               <img [src]="config().logoUrl" alt="Logo" class="h-12 object-contain mb-2">
           }
           <span class="font-serif font-bold text-2xl text-white">ALPERLER <span class="text-amber-500">Admin</span></span>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
           <a (click)="closeSidebar()" routerLink="/admin/dashboard" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              Dashboard
           </a>
           
           <div class="px-4 py-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Rezervasyonlar</div>
           <a (click)="closeSidebar()" routerLink="/admin/reservations" [queryParams]="{type: 'RENTAL'}" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all pl-8">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              Araç Kiralama
           </a>
           <a (click)="closeSidebar()" routerLink="/admin/reservations" [queryParams]="{type: 'TOUR'}" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all pl-8">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Tur Talepleri
           </a>
           <a (click)="closeSidebar()" routerLink="/admin/reservations" [queryParams]="{type: 'SALE_INQUIRY'}" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all pl-8">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Satın Alma Talepleri
           </a>

           <div class="px-4 py-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Araçlar</div>
           <a (click)="closeSidebar()" routerLink="/admin/cars" [queryParams]="{tab: 'RENTAL'}" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all pl-8">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              Kiralık Araçlar
           </a>
           <a (click)="closeSidebar()" routerLink="/admin/cars" [queryParams]="{tab: 'SALES'}" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all pl-8">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Satılık Araçlar
           </a>

           <div class="px-4 py-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Diğer</div>
           <a (click)="closeSidebar()" routerLink="/admin/tours" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Turlar
           </a>
           <a (click)="closeSidebar()" routerLink="/admin/blog" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Blog Yazıları
           </a>
           
           <a (click)="closeSidebar()" routerLink="/admin/requests" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Başvurular
           </a>

           <a (click)="closeSidebar()" routerLink="/admin/feedback" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
              Geri Bildirimler
           </a>
           
           <a (click)="closeSidebar()" routerLink="/admin/settings" routerLinkActive="bg-amber-500 text-slate-900 font-bold shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all mt-4 border-t border-white/10">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Genel Ayarlar
           </a>
        </nav>

        <div class="p-4 border-t border-white/10 space-y-2">
           <a routerLink="/" class="flex items-center px-4 py-3 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Siteye Dön
           </a>
           <button (click)="logout()" class="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-bold">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Çıkış Yap
           </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto">
         <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  carService = inject(CarService);
  config = this.carService.getConfig();
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  logout() {
    this.authService.logout();
  }
}
