
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService, SaleCar } from '../services/car.service';
import { Router } from '@angular/router';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen pt-28 pb-20 font-sans">
      <!-- Header -->
      <div class="bg-slate-900 text-white py-12 mb-12">
         <div class="max-w-7xl mx-auto px-4 text-center">
            <span class="text-amber-500 font-bold tracking-[0.3em] uppercase text-xs block mb-4">{{ t().sales.badge }}</span>
            <h1 class="font-serif text-4xl md:text-6xl font-bold">{{ t().sales.headerTitle }}</h1>
            <p class="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">{{ t().sales.headerSubtitle }}</p>
         </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <!-- Info Cards -->
         <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-center">
             <div class="p-4 bg-slate-50 rounded border border-slate-100">
                 <div class="font-bold text-slate-900">{{ t().sales.card1 }}</div>
             </div>
             <div class="p-4 bg-slate-50 rounded border border-slate-100">
                 <div class="font-bold text-slate-900">{{ t().sales.card2 }}</div>
             </div>
             <div class="p-4 bg-slate-50 rounded border border-slate-100">
                 <div class="font-bold text-slate-900">{{ t().sales.card3 }}</div>
             </div>
             <div class="p-4 bg-slate-50 rounded border border-slate-100">
                 <div class="font-bold text-slate-900">{{ t().sales.card4 }}</div>
             </div>
         </div>

         <div class="grid grid-cols-1 gap-8">
            @for (car of saleCars(); track car.id) {
               <div class="flex flex-col md:flex-row bg-white border border-slate-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative">
                  
                  <!-- Favorite Button -->
                  <button (click)="toggleFav(car.id)" class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:scale-110 shadow-md cursor-pointer">
                        @if (isFav(car.id)) {
                           <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        } @else {
                           <svg class="w-6 h-6 text-slate-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        }
                  </button>

                  <!-- Image Side -->
                  <div class="md:w-1/2 lg:w-2/5 relative h-72 md:h-auto overflow-hidden bg-slate-100">
                     <img [src]="car.image" [alt]="car.model" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
                     <div class="absolute top-4 left-4 bg-amber-500 text-slate-900 px-3 py-1 font-bold text-xs uppercase tracking-wider rounded-sm">
                        {{ t().sales.status.forSale }}
                     </div>
                  </div>
                  
                  <!-- Content Side -->
                  <div class="md:w-1/2 lg:w-3/5 p-8 flex flex-col justify-between">
                     <div>
                        <div class="flex flex-wrap justify-between items-start mb-2">
                           <h3 class="text-2xl font-serif font-bold text-slate-900 mr-2">{{car.brand}} {{car.model}}</h3>
                           <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">{{car.year}} {{ t().car.year }}</span>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mb-4 text-xs font-bold text-slate-500">
                           <span class="bg-slate-50 px-2 py-1 rounded border">{{car.fuel}}</span>
                           <span class="bg-slate-50 px-2 py-1 rounded border">{{car.transmission}}</span>
                           <span class="bg-slate-50 px-2 py-1 rounded border">{{car.km | number}} {{ t().car.km }}</span>
                        </div>

                        <p class="text-slate-500 mb-4 leading-relaxed text-sm">{{car.description}}</p>
                        
                        <!-- Expert Report Highlight -->
                        @if(car.expertReport) {
                           <div class="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4">
                              <span class="text-xs font-bold text-amber-600 uppercase block mb-1">{{ t().sales.expert }}</span>
                              <span class="text-slate-800 font-medium text-sm">{{ car.expertReport }}</span>
                           </div>
                        }
                        
                        <!-- Features -->
                        <div class="flex flex-wrap gap-2 mb-6">
                           @for(feature of car.features; track feature) {
                              <div class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 flex items-center">
                                 <svg class="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                 {{feature}}
                              </div>
                           }
                        </div>
                     </div>

                     <div class="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-100 mt-4 gap-4">
                        <div class="text-3xl font-bold text-slate-900">{{car.price | number}} ₺</div>
                        <div class="flex gap-2 w-full sm:w-auto">
                            <button (click)="inquireCar(car, 'MEET')" [attr.aria-label]="t().sales.appointment + ': ' + car.brand + ' ' + car.model" class="flex-1 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-slate-50 transition-colors">
                                {{ t().sales.appointment }}
                            </button>
                            <button (click)="inquireCar(car, 'INFO')" [attr.aria-label]="t().sales.buy + ': ' + car.brand + ' ' + car.model" class="flex-1 px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-amber-500 hover:text-slate-900 transition-colors">
                                {{ t().sales.buy }}
                            </button>
                        </div>
                     </div>
                  </div>
               </div>
            }
         </div>
      </div>
    </div>
  `
})
export class SalesComponent {
  carService = inject(CarService);
  router = inject(Router);
  uiService = inject(UiService);
  t = this.uiService.translations;
  saleCars = this.carService.getSaleCars();

  toggleFav(id: number) {
    this.carService.toggleFavorite(id);
  }

  isFav(id: number) {
    return this.carService.isFavorite(id);
  }

  inquireCar(car: SaleCar, type: 'INFO' | 'MEET') {
    const msg = type === 'MEET' ? 'RANDEVU TALEBİ: Aracı yerinde görüp incelemek istiyorum.' : 'SATIN ALMA TALEBİ: Araç hakkında detaylı görüşmek istiyorum.';
    
    this.carService.setBookingRequest({
      type: 'SALE_INQUIRY',
      item: car,
      itemName: `${car.brand} ${car.model} (${car.year}) - ${type === 'MEET' ? 'Randevu' : 'Bilgi'}`,
      image: car.image,
      basePrice: car.price
    });
    this.router.navigate(['/contact']);
  }
}
