
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../services/car.service';
import { UiService } from '../services/ui.service';
import { Car } from '../models/car.model';
import { CarImageCarouselComponent } from '../components/car-image-carousel.component';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CarImageCarouselComponent],
  template: `
    <div class="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Back Button -->
        <button (click)="goBack()" class="mb-6 flex items-center text-slate-600 hover:text-slate-900 transition-colors">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          {{ t().buttons.back || 'Geri Dön' }}
        </button>

        @if (car(); as c) {
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              <!-- Image Section -->
              <div class="h-96 lg:h-auto bg-slate-200 relative">
                 <app-car-image-carousel [images]="c.images || [c.image]" [altText]="c.model"></app-car-image-carousel>
                 
                 <!-- Badges -->
                 <div class="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none z-20">
                    <div class="bg-white/90 backdrop-blur px-4 py-1.5 rounded-md text-sm font-bold uppercase shadow-sm text-slate-900 self-start">
                        {{ translateDbValue(c.fuel, 'fuel') }}
                    </div>
                    <div class="bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-md text-sm font-bold uppercase shadow-sm text-white self-start">
                        {{ translateDbValue(c.transmission, 'transmission') }}
                    </div>
                 </div>
              </div>

              <!-- Content Section -->
              <div class="p-8 lg:p-12 flex flex-col">
                
                <div class="flex justify-between items-start mb-6">
                   <div>
                      <h1 class="text-3xl lg:text-4xl font-bold text-slate-900 font-serif mb-2">{{c.brand}} {{c.model}}</h1>
                      <p class="text-slate-500 text-lg">{{ translateDbValue(c.type, 'type') }}</p>
                   </div>
                   <div class="text-right">
                       <span class="block text-3xl font-bold text-slate-900">{{c.price}} ₺</span>
                       <span class="text-sm text-slate-400 font-normal">/{{ t().car.day }}</span>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-8">
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
                      <svg class="w-6 h-6 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                      <div>
                        <span class="block text-xs text-slate-400 uppercase tracking-wider">{{ t().car.transmission }}</span>
                        <span class="font-semibold text-slate-700">{{ translateDbValue(c.transmission, 'transmission') }}</span>
                      </div>
                   </div>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
                      <svg class="w-6 h-6 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      <div>
                        <span class="block text-xs text-slate-400 uppercase tracking-wider">{{ t().car.fuel }}</span>
                        <span class="font-semibold text-slate-700">{{ translateDbValue(c.fuel, 'fuel') }}</span>
                      </div>
                   </div>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
                      <svg class="w-6 h-6 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      <div>
                        <span class="block text-xs text-slate-400 uppercase tracking-wider">{{ t().car.seats }}</span>
                        <span class="font-semibold text-slate-700">{{c.seats}} {{ t().car.seats }}</span>
                      </div>
                   </div>
                   <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center">
                      <svg class="w-6 h-6 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <div>
                        <span class="block text-xs text-slate-400 uppercase tracking-wider">{{ t().filters.all }}</span>
                        <span class="font-semibold text-slate-700">{{ c.isAvailable ? t().buttons.rent : t().buttons.notAvailable }}</span>
                      </div>
                   </div>
                </div>

                <h3 class="text-lg font-bold text-slate-900 mb-4">{{ t().car.features || 'Özellikler' }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    @for (feat of c.features; track feat) {
                        <div class="flex items-center text-slate-600 bg-white border border-slate-100 p-3 rounded-lg">
                            <svg class="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> 
                            {{feat}}
                        </div>
                    }
                </div>

                <div class="mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button (click)="rentCar(c)" 
                            [disabled]="!c.isAvailable"
                            class="flex-1 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500 text-lg">
                       <span>{{ !c.isAvailable ? t().buttons.notAvailable : t().buttons.rent }}</span>
                       @if(c.isAvailable) {
                           <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                       }
                    </button>
                    
                    <button (click)="toggleFav(c.id)" [class.text-red-500]="isFav(c.id)" [class.bg-red-50]="isFav(c.id)" class="sm:w-16 h-14 sm:h-auto rounded-xl border-2 border-slate-200 flex items-center justify-center hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <svg class="w-6 h-6 fill-current" [class.text-slate-300]="!isFav(c.id)" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </button>
                </div>

              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-20">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
             <p class="text-slate-500">Araç yükleniyor...</p>
          </div>
        }

      </div>
    </div>
  `
})
export class CarDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  carService = inject(CarService);
  uiService = inject(UiService);
  
  car = signal<Car | undefined>(undefined);
  t = this.uiService.translations;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        const foundCar = this.carService.getCar(id);
        if (foundCar) {
            this.car.set(foundCar);
        } else {
            this.router.navigate(['/fleet']);
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/fleet']);
  }

  rentCar(car: Car) {
    const request = {
      type: 'RENTAL' as const,
      item: car,
      itemName: `${car.brand} ${car.model}`,
      image: car.image,
      basePrice: car.price,
      startDate: '',
      endDate: '',
      withDriver: false
    };

    this.carService.setBookingRequest(request);
    this.uiService.toggleContact(true);
  }

  toggleFav(id: number) {
    this.carService.toggleFavorite(id);
  }

  isFav(id: number) {
    return this.carService.isFavorite(id);
  }

  translateDbValue(value: string, category: 'fuel' | 'transmission' | 'type'): string {
    const t = this.uiService.translations();
    if (category === 'fuel') {
      if (value === 'Dizel') return t.car.diesel;
      if (value === 'Benzin') return t.car.gasoline;
      if (value === 'Hibrit') return t.car.hybrid;
      if (value === 'Elektrik') return t.car.electric;
    }
    if (category === 'transmission') {
      if (value === 'Otomatik') return t.car.auto;
      if (value === 'Manuel') return t.car.manual;
    }
    if (category === 'type') {
      if (value === 'SUV') return t.filters.suv;
      if (value === 'Sedan') return t.filters.sedan;
      if (value === 'Hatchback') return t.filters.hatchback;
      if (value === 'Pickup') return t.filters.pickup;
      if (value === 'Luxury') return t.filters.luxury;
    }
    return value;
  }
}
