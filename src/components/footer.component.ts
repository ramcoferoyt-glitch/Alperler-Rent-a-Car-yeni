
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarService } from '../services/car.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
    <footer class="bg-slate-950 text-slate-400 pt-16 border-t border-slate-900 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <!-- Brand Info -->
          <div class="col-span-1">
            <div class="flex items-center mb-6 group cursor-pointer" routerLink="/">
              @if(config().logoUrl) {
                  <img [src]="config().logoUrl" alt="Alperler Rent A Car Logo" class="h-10 object-contain mr-3">
              } @else {
                  <div class="w-10 h-10 bg-amber-500 text-slate-900 flex items-center justify-center font-serif font-bold text-xl mr-3 rounded-sm group-hover:bg-white transition-colors">A</div>
                  <span class="text-2xl font-serif font-bold text-white tracking-tight group-hover:text-amber-500 transition-colors">ALPERLER</span>
              }
            </div>
            <p class="text-slate-500 mb-6 leading-relaxed text-sm">
              {{ config().footerText }}
            </p>
            
            <!-- Social Media Icons (Clean Row) -->
            <div class="flex space-x-4">
                <a [href]="'https://wa.me/' + config().whatsapp" target="_blank" aria-label="WhatsApp" class="text-slate-400 hover:text-green-500 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
                <a [href]="config().instagramUrl" target="_blank" aria-label="Instagram" class="text-slate-400 hover:text-pink-500 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a [href]="config().twitterUrl" target="_blank" aria-label="X (Twitter)" class="text-slate-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a [href]="config().facebookUrl" target="_blank" aria-label="Facebook" class="text-slate-400 hover:text-blue-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a [href]="config().tiktokUrl" target="_blank" aria-label="TikTok" class="text-slate-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.37-1.77 1.54-4.15 2.36-6.55 2.26-2.36-.1-4.66-1.1-6.27-2.89-1.6-1.78-2.3-4.15-1.92-6.5.38-2.35 1.7-4.46 3.65-5.79 1.95-1.32 4.4-1.65 6.63-.92.08.03.15.07.23.11v4.15c-.96-.52-2.09-.77-3.21-.71-1.13.06-2.2.56-2.97 1.42-.78.86-1.18 1.98-1.13 3.11.05 1.13.56 2.21 1.42 2.97.87.76 1.99 1.15 3.12 1.09 1.14-.05 2.21-.57 2.97-1.43.76-.87 1.15-1.99 1.09-3.12v-14.4z"/></svg>
                </a>
                <a [href]="config().youtubeUrl" target="_blank" aria-label="YouTube" class="text-slate-400 hover:text-red-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-bold uppercase tracking-wider text-xs mb-6 text-amber-500">Kurumsal</h3>
            <ul class="space-y-3 text-sm">
              <li><button (click)="openAbout()" class="hover:text-amber-500 transition-colors">Hakkımızda</button></li>
              <li><a routerLink="/fleet" class="hover:text-amber-500 transition-colors">Araç Filosu</a></li>
              <li><a routerLink="/sales" class="hover:text-amber-500 transition-colors">Satılık Araçlar</a></li>
              <li><a routerLink="/list-your-car" class="hover:text-amber-500 transition-colors">Aracını Kiraya Ver</a></li>
              <li><a routerLink="/blog" class="hover:text-amber-500 transition-colors">Blog</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="text-white font-bold uppercase tracking-wider text-xs mb-6 text-amber-500">Yasal</h3>
            <ul class="space-y-3 text-sm">
              <li><button (click)="openLegal('terms')" class="hover:text-amber-500 transition-colors">Kullanım Şartları</button></li>
              <li><button (click)="openLegal('distance-selling')" class="hover:text-amber-500 transition-colors">Mesafeli Satış Sözleşmesi</button></li>
              <li><button (click)="openLegal('cancellation')" class="hover:text-amber-500 transition-colors">İade ve İptal Politikası</button></li>
              <li><button (click)="openLegal('insurance')" class="hover:text-amber-500 transition-colors">Araç Sigorta ve Sorumluluk</button></li>
              <li><button (click)="openLegal('kvkk')" class="hover:text-amber-500 transition-colors">KVKK Aydınlatma Metni</button></li>
              <li><button (click)="openLegal('privacy')" class="hover:text-amber-500 transition-colors">Gizlilik Politikası</button></li>
              <li><button (click)="openLegal('cookies')" class="hover:text-amber-500 transition-colors">Çerez Politikası</button></li>
              <li><a routerLink="/faq" class="hover:text-amber-500 transition-colors">Sıkça Sorulan Sorular</a></li>
              <!-- Feedback Link -->
              <li><button (click)="openFeedback()" class="text-amber-500 hover:text-amber-400 transition-colors font-medium flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                  Geri Bildirim Gönder
              </button></li>
            </ul>
          </div>

          <!-- Newsletter & Contact -->
          <div>
            <h3 class="text-white font-bold uppercase tracking-wider text-xs mb-6 text-amber-500">Bülten Aboneliği</h3>
            <p class="text-sm text-slate-500 mb-4">Kampanyalardan ve yeni araçlardan haberdar olmak için ücretsiz abone olun.</p>
            
            <form (submit)="subscribe($event)" class="mb-8">
                <div class="flex flex-col space-y-2">
                    <input type="email" [(ngModel)]="email" name="email" aria-label="E-posta Adresiniz" placeholder="E-posta adresiniz" required class="w-full bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg px-4 py-3 focus:ring-1 focus:ring-amber-500 outline-none transition-all">
                    <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                        Ücretsiz Abone Ol
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                </div>
                @if (subscribed()) {
                    <div class="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-start animate-fade-in">
                        <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <p class="text-green-500 text-xs font-bold">Tebrikler! Bültenimize başarıyla abone oldunuz. Kampanyalarımızdan ilk siz haberdar olacaksınız.</p>
                    </div>
                }
            </form>

            <h3 class="text-white font-bold uppercase tracking-wider text-xs mb-4 text-amber-500">Bize Ulaşın</h3>
            <button (click)="openContact()" class="inline-flex items-center justify-center bg-slate-800 hover:bg-white hover:text-slate-900 text-slate-300 font-bold py-3 px-6 rounded-lg transition-all duration-300 w-full border border-slate-700 hover:border-white">
                İletişime Geç
            </button>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="border-t border-slate-900 py-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 relative">
          
          <div class="mb-4 md:mb-0 text-center md:text-left w-full md:w-auto">
             <span>&copy; {{ currentYear }} {{ config().companyName }}. {{ t().footer.rights }}</span>
             <a routerLink="/admin/login" class="ml-2 text-slate-800 hover:text-slate-600 transition-colors" aria-label="Yönetici Girişi">
                <svg class="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
             </a>
          </div>
          <div class="flex items-center justify-center md:justify-end w-full md:w-auto">
             <span>Designed with ❤️ in Yüksekova</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  carService = inject(CarService);
  uiService = inject(UiService);
  config = this.carService.getConfig();
  t = this.uiService.translations;
  currentYear = new Date().getFullYear();
  
  email = '';
  subscribed = signal(false);

  subscribe(e: Event) {
      e.preventDefault();
      if (this.email) {
          this.carService.addSubscriber(this.email);
          this.subscribed.set(true);
          this.email = '';
          setTimeout(() => this.subscribed.set(false), 3000);
      }
  }

  openAbout() {
      this.uiService.toggleAbout(true);
  }

  openContact() {
      this.uiService.toggleContact(true);
  }

  openLegal(type: 'kvkk' | 'privacy' | 'cookies' | 'terms' | 'distance-selling' | 'cancellation' | 'insurance') {
      this.uiService.openLegal(type);
  }

  openFeedback() {
      this.uiService.toggleFeedback(true);
  }
}
