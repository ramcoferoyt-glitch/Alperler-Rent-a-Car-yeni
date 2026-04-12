import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgOptimizedImage, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../services/car.service';
import { UiService } from '../services/ui.service';
import { MatIconModule } from '@angular/material/icon';
import { register } from 'swiper/element/bundle';
import { Car } from '../models/car.model';
import { ExpertiseGraphicComponent } from '../components/expertise-graphic.component';
import { getTechnicalSpecs } from '../data/technical-specs.data';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-sale-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, ExpertiseGraphicComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="min-h-screen bg-[#f4f4f4] pb-24 lg:pb-0 font-sans text-[#212121]">
      
      <!-- 1. Blue Header -->
      <header class="sticky top-0 z-[60] bg-[#005c8d] text-white flex items-center justify-between px-4 h-14 shadow-md">
        <div class="flex items-center gap-3">
          <button (click)="goBack()" aria-label="Geri Dön" class="p-1 hover:bg-white/10 rounded-full transition-colors">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-lg font-bold tracking-tight">İlan Detayı</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <button (click)="shareCar(car())" aria-label="Paylaş" class="p-1 hover:bg-white/10 rounded-full transition-colors">
            <mat-icon>share</mat-icon>
          </button>
          <button (click)="toggleFav(car()?.id)" aria-label="Favorilere Ekle/Çıkar" class="p-1 hover:bg-white/10 rounded-full transition-colors">
            <mat-icon [class.text-amber-400]="isFav(car()?.id)">
              {{ isFav(car()?.id) ? 'star' : 'star_border' }}
            </mat-icon>
          </button>
        </div>
      </header>

      <!-- 2. Media Area -->
      <div class="relative w-full aspect-square md:aspect-[16/9] bg-white overflow-hidden border-b border-slate-200">
        <swiper-container 
          #swiper
          class="w-full h-full" 
          pagination="false" 
          navigation="false"
          space-between="0"
          loop="true"
          (slidechange)="onSlideChange($event)"
        >
          @for (img of allImages(); track $index) {
            <swiper-slide class="w-full h-full cursor-zoom-in" (click)="openLightbox($index)">
              <img [src]="img" [alt]="car()?.brand + ' ' + car()?.model" class="w-full h-full object-contain" referrerpolicy="no-referrer">
            </swiper-slide>
          }
        </swiper-container>

        <!-- Page Indicator -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md text-white px-3 py-0.5 rounded-full text-[11px] font-medium">
          {{ currentSlide() + 1 }} / {{ allImages().length }}
        </div>

        <!-- Premium Badge Overlay -->
        <div class="absolute bottom-0 right-0 z-10 flex flex-col items-end">
           <div class="bg-[#e0e0e0] text-[#666] px-4 py-1 text-[10px] font-bold rounded-tl-lg shadow-sm border-l border-t border-white/50">
             Premium Galeri
           </div>
           <div class="bg-amber-400 text-white p-1 rounded-bl-lg shadow-md flex items-center justify-center">
             <mat-icon class="text-[18px] w-[18px] h-[18px]">stars</mat-icon>
             <span class="text-[10px] font-black ml-0.5">3. YIL</span>
           </div>
        </div>
      </div>

      <!-- 3. Title & Price -->
      <div class="bg-white px-4 py-4 space-y-2 shadow-sm border-b border-slate-200">
        <h2 class="text-xl font-bold text-[#212121]">
          {{ car()?.brand }} {{ car()?.series }} {{ car()?.model }}
        </h2>
        <div class="text-[13px] text-[#666] font-medium">
          {{ car()?.year }} • {{ car()?.km | number }} KM • {{ car()?.fuel }} • {{ car()?.transmission }}
        </div>
        <div class="text-2xl font-black text-[#005c8d] mt-2">
          {{ car()?.price | number:'1.0-0' }} TL
        </div>
      </div>

      <!-- 4. Tabs -->
      <div class="flex border-b border-slate-200 sticky top-14 z-50 bg-white shadow-sm">
        <button 
          (click)="activeTab.set('info')" 
          aria-label="İlan Bilgileri Sekmesi"
          [class.bg-amber-400]="activeTab() === 'info'"
          [class.text-white]="activeTab() === 'info'"
          class="flex-1 py-3 text-[12px] font-bold uppercase tracking-tight transition-colors border-r border-slate-100"
        >
          İlan Bilgileri
        </button>
        <button 
          (click)="activeTab.set('desc')" 
          aria-label="Açıklama Sekmesi"
          [class.bg-amber-400]="activeTab() === 'desc'"
          [class.text-white]="activeTab() === 'desc'"
          class="flex-1 py-3 text-[12px] font-bold uppercase tracking-tight transition-colors border-r border-slate-100"
        >
          Açıklama
        </button>
        <button 
          (click)="activeTab.set('loc')" 
          aria-label="Konum Sekmesi"
          [class.bg-amber-400]="activeTab() === 'loc'"
          [class.text-white]="activeTab() === 'loc'"
          class="flex-1 py-3 text-[12px] font-bold uppercase tracking-tight transition-colors"
        >
          Konumu
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="max-w-4xl mx-auto bg-white min-h-[400px]">
        
        <!-- Tab: İlan Bilgileri -->
        @if (activeTab() === 'info') {
          <div class="divide-y divide-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">İlan Tarihi</span>
              <span class="font-medium text-[#333]">{{ car()?.createdAt || '05 Nisan 2026' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">İlan No</span>
              <span class="font-bold text-[#d32f2f]">{{ car()?.id }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Marka</span>
              <span class="font-medium text-[#333]">{{ car()?.brand }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Seri</span>
              <span class="font-medium text-[#333]">{{ car()?.series || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Model</span>
              <span class="font-medium text-[#333]">{{ car()?.model }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Yıl</span>
              <span class="font-medium text-[#333]">{{ car()?.year }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Yakıt Tipi</span>
              <span class="font-medium text-[#333]">{{ car()?.fuel }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Vites Tipi</span>
              <span class="font-medium text-[#333]">{{ car()?.transmission }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Kilometre</span>
              <span class="font-medium text-[#333]">{{ car()?.km | number }} km</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Kasa Tipi</span>
              <span class="font-medium text-[#333]">{{ car()?.type || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Motor Gücü</span>
              <span class="font-medium text-[#333]">{{ car()?.enginePower || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Motor Hacmi</span>
              <span class="font-medium text-[#333]">{{ car()?.engineVolume || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Çekiş</span>
              <span class="font-medium text-[#333]">{{ car()?.drivetrain || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Renk</span>
              <span class="font-medium text-[#333]">{{ car()?.color || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Garanti</span>
              <span class="font-medium text-[#333]">{{ car()?.warranty || '-' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Ağır Hasar Kayıtlı</span>
              <span class="font-medium text-[#333]">{{ car()?.isDamageFree ? 'Hayır' : 'Evet' }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Kimden</span>
              <span class="font-medium text-[#333]">Galeriden</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px]">
              <span class="text-[#666]">Takas</span>
              <span class="font-medium text-[#333]">Evet</span>
            </div>
            <div class="flex justify-between px-4 py-3 text-[13px] bg-slate-50/50">
              <span class="text-[#666]">Durumu</span>
              <span class="font-medium text-[#333]">İkinci El</span>
            </div>
            
            @if (techSpecs()) {
              <div class="p-4 bg-white">
                <button (click)="isTechSpecsOpen.set(true)" class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <mat-icon class="text-sm">settings_suggest</mat-icon>
                  Tüm Teknik Özellikleri Görüntüle
                </button>
              </div>
            }
          </div>

          <!-- Expertise Section (Inside Info Tab) -->
          <div class="p-4 border-t border-slate-100 bg-slate-50/30">
            <h3 class="text-sm font-bold text-[#005c8d] mb-4 flex items-center gap-2">
              <mat-icon class="text-[18px] w-[18px] h-[18px]">verified</mat-icon>
              Ekspertiz Durumu
            </h3>
            <app-expertise-graphic [data]="car()?.damageExpertise"></app-expertise-graphic>
            <div class="mt-4 p-3 bg-white rounded-lg border border-slate-100 text-[12px] text-[#666] italic">
              {{ car()?.tramer || 'Tramer kaydı bulunmamaktadır.' }}
            </div>
          </div>
        }

        <!-- Tab: Açıklama -->
        @if (activeTab() === 'desc') {
          <div class="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="prose prose-sm max-w-none text-[#333] leading-relaxed whitespace-pre-line">
              {{ car()?.description }}
            </div>
          </div>
        }

        <!-- Tab: Konumu -->
        @if (activeTab() === 'loc') {
          <div class="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
            <div class="aspect-video bg-slate-100 rounded-xl flex flex-col items-center justify-center text-[#999] border-2 border-dashed border-slate-200">
              <mat-icon class="text-4xl mb-2">map</mat-icon>
              <span class="text-sm font-medium">Harita Yükleniyor...</span>
              <span class="text-xs mt-1">Hakkari, Yüksekova, Merkez Mah.</span>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
              <mat-icon class="text-[#005c8d]">location_on</mat-icon>
              <div>
                <div class="font-bold text-sm text-[#005c8d]">Adres Bilgisi</div>
                <div class="text-xs text-[#666] mt-0.5">İpekyolu Cad. No:123 Alperler Plaza, Yüksekova/Hakkari</div>
              </div>
            </div>
          </div>
        }

      </div>

      <!-- 6. Bottom Action Bar -->
      <div class="fixed bottom-0 left-0 right-0 z-[70] bg-white border-t border-slate-200 p-2 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <a 
          [href]="'tel:' + carService.getConfig()().phone" 
          class="flex-1 bg-[#005c8d] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <mat-icon>call</mat-icon>
          <span class="text-sm">Ara</span>
        </a>
        <button 
          (click)="inquireCar(car())" 
          aria-label="Satış Talebi Gönder"
          class="flex-1 bg-[#005c8d] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <mat-icon>request_quote</mat-icon>
          <span class="text-sm">Satış Talebi Gönder</span>
        </button>
        
        <!-- Floating WhatsApp/Action Button (Green) -->
        <button 
          (click)="whatsappInquiry()"
          aria-label="WhatsApp ile İletişime Geç"
          class="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-90 transition-all border-4 border-white"
        >
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.383 0 0 5.383 0 12.031c0 2.656.832 5.12 2.28 7.184L.52 24l4.928-1.728A11.95 11.95 0 0012.031 24c6.648 0 12.031-5.383 12.031-12.031C24.062 5.383 18.679 0 12.031 0zm6.544 17.296c-.28.784-1.584 1.456-2.208 1.528-.584.064-1.344.16-3.84-1.04-3.04-1.464-4.992-4.576-5.144-4.784-.144-.2-1.224-1.632-1.224-3.112 0-1.48.768-2.208 1.04-2.504.28-.296.608-.368.808-.368.2 0 .4 0 .576.008.192.008.448-.072.688.512.248.608.848 2.072.92 2.232.072.16.12.352.024.544-.096.192-.144.312-.288.48-.144.168-.304.368-.432.496-.144.144-.296.304-.128.584.168.28 .752 1.232 1.616 1.984 1.112.968 2.048 1.272 2.328 1.416.28.144.448.12.616-.072.168-.192.728-.848.928-1.144.2-.296.4-.248.664-.152.264.096 1.68.792 1.968.936.288.144.48.216.552.336.072.12.072.704-.208 1.488z"/></svg>
        </button>
      </div>

      <!-- Lightbox -->
      @if (isLightboxOpen()) {
        <div class="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            <div class="flex justify-between items-center p-4 text-white z-10">
                <span class="font-bold tracking-widest text-sm">{{ activeImageIndex() + 1 }} / {{ allImages().length }}</span>
                <button (click)="closeLightbox()" aria-label="Kapat" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            
            <div class="flex-1 relative w-full h-full">
                <swiper-container 
                  class="w-full h-full" 
                  [initialSlide]="activeImageIndex()"
                  pagination="false" 
                  navigation="true"
                  space-between="20"
                  (slidechange)="onLightboxSlideChange($event)"
                >
                  @for (img of allImages(); track $index) {
                    <swiper-slide class="w-full h-full flex items-center justify-center p-4">
                      <img [src]="img" class="max-w-full max-h-full object-contain" referrerpolicy="no-referrer">
                    </swiper-slide>
                  }
                </swiper-container>
            </div>
        </div>
      }

      <!-- Tech Specs Modal -->
      @if (isTechSpecsOpen()) {
        <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center animate-in fade-in duration-300">
            <div class="bg-white w-full md:w-[500px] md:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
                <div class="flex justify-between items-center p-5 border-b border-slate-100">
                    <div>
                        <h3 class="font-bold text-lg text-[#212121]">Teknik Özellikler</h3>
                        <p class="text-xs text-slate-500">{{ car()?.brand }} {{ car()?.model }}</p>
                    </div>
                    <button (click)="isTechSpecsOpen.set(false)" class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200">
                        <mat-icon class="text-sm">close</mat-icon>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-5 space-y-6">
                    @if (techSpecs(); as specs) {
                        <!-- Performans -->
                        <div>
                            <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <mat-icon class="text-[16px] w-[16px] h-[16px]">speed</mat-icon> Performans
                            </h4>
                            <div class="bg-slate-50 rounded-xl p-4 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Maksimum Hız</span>
                                    <span class="font-medium text-[#212121]">{{ specs.maxSpeed }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Hızlanma (0-100)</span>
                                    <span class="font-medium text-[#212121]">{{ specs.acceleration }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Motor & Aktarma -->
                        <div>
                            <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <mat-icon class="text-[16px] w-[16px] h-[16px]">engineering</mat-icon> Motor & Aktarma
                            </h4>
                            <div class="bg-slate-50 rounded-xl p-4 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Motor Hacmi</span>
                                    <span class="font-medium text-[#212121]">{{ specs.engineVolume }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Motor Gücü</span>
                                    <span class="font-medium text-[#212121]">{{ specs.enginePower }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Tork</span>
                                    <span class="font-medium text-[#212121]">{{ specs.torque }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Silindir Sayısı</span>
                                    <span class="font-medium text-[#212121]">{{ specs.cylinders }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Çekiş</span>
                                    <span class="font-medium text-[#212121]">{{ specs.drivetrain }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Tüketim -->
                        <div>
                            <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <mat-icon class="text-[16px] w-[16px] h-[16px]">local_gas_station</mat-icon> Yakıt Tüketimi
                            </h4>
                            <div class="bg-slate-50 rounded-xl p-4 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Şehir İçi</span>
                                    <span class="font-medium text-[#212121]">{{ specs.cityFuel }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Şehir Dışı (Uzun Yol)</span>
                                    <span class="font-medium text-[#212121]">{{ specs.highwayFuel }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Karma</span>
                                    <span class="font-medium text-[#212121]">{{ specs.combinedFuel }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Yakıt Deposu</span>
                                    <span class="font-medium text-[#212121]">{{ specs.tankCapacity }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Boyutlar & Kapasite -->
                        <div>
                            <h4 class="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <mat-icon class="text-[16px] w-[16px] h-[16px]">straighten</mat-icon> Boyutlar & Kapasite
                            </h4>
                            <div class="bg-slate-50 rounded-xl p-4 space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Bagaj Hacmi</span>
                                    <span class="font-medium text-[#212121]">{{ specs.trunkCapacity }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Ölçüler (U x G x Y)</span>
                                    <span class="font-medium text-[#212121]">{{ specs.dimensions }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Ağırlık</span>
                                    <span class="font-medium text-[#212121]">{{ specs.weight }}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-500">Lastik / Jant</span>
                                    <span class="font-medium text-[#212121]">{{ specs.wheels }}</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
      }
    </div>
  `
})
export class SaleCarDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  carService = inject(CarService);
  uiService = inject(UiService);

  car = signal<Car | null>(null);
  isScrolled = signal(false);
  isLightboxOpen = signal(false);
  isTechSpecsOpen = signal(false);
  activeImageIndex = signal(0);
  activeSection = signal<string | null>(null);
  activeTab = signal<'info' | 'desc' | 'loc'>('info');
  currentSlide = signal(0);

  techSpecs = computed(() => {
    const c = this.car();
    if (!c) return null;
    let modelKey = c.model;
    if (c.series) {
        modelKey = `${c.series} ${c.model}`.trim();
    }
    return getTechnicalSpecs(c.brand, modelKey) || getTechnicalSpecs(c.brand, c.model);
  });

  openLightbox(index: number) {
    this.activeImageIndex.set(index);
    this.isLightboxOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
    document.body.style.overflow = 'auto';
  }
  
  t = this.uiService.translations;
  isFav = (id: number | undefined) => id ? this.carService.isFavorite(id) : false;

  allImages = computed(() => {
    const c = this.car();
    if (!c) return [];
    return [c.image, ...(c.gallery || [])];
  });

  similarCars = computed(() => {
    const currentCar = this.car();
    if (!currentCar) return [];
    
    return this.carService.getSaleCars()()
      .filter(c => c.id !== currentCar.id && (c.brand === currentCar.brand || Math.abs(c.price - currentCar.price) < 100000))
      .slice(0, 3);
  });

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 100);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        const found = this.carService.getSaleCar(id);
        if (found) {
          this.car.set(found);
        } else {
          this.router.navigate(['/sales']);
        }
      }
    });
  }

  ngOnDestroy() {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/sales']);
    }
  }

  toggleSection(section: string) {
    this.activeSection.update(current => current === section ? null : section);
  }

  onSlideChange(event: any) {
    this.currentSlide.set(event.detail[0].realIndex);
  }

  onLightboxSlideChange(event: any) {
    this.activeImageIndex.set(event.detail[0].activeIndex);
  }

  toggleFav(id: number | undefined) {
    if (id) {
      this.carService.toggleFavorite(id);
    }
  }

  shareCar(car: Car | null) {
    if (!car) return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${car.brand} ${car.model} - Alperler Rent A Car`,
        text: `${car.brand} ${car.model} aracını inceleyin!`,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert(this.t().common.linkCopied);
      });
    }
  }

  inquireCar(car: Car | null) {
    if (!car) return;

    this.carService.setBookingRequest({
      type: 'SALE_INQUIRY',
      item: car,
      itemName: `${car.brand} ${car.model}`,
      image: car.image,
      basePrice: car.price
    });
    this.router.navigate(['/contact']);
  }

  whatsappInquiry() {
    const c = this.car();
    if (!c) return;

    const msg = this.t().car.whatsappMsg
      .replace('{brand}', c.brand)
      .replace('{model}', c.model)
      .replace('{year}', c.year?.toString() || '')
      .replace('{url}', window.location.href);
    
    window.open(`https://wa.me/${this.carService.getConfig()().phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
