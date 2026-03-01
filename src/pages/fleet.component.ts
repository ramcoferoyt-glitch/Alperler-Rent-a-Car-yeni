
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../services/car.service';
import { UiService } from '../services/ui.service';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Car } from '../models/car.model';
import { CarImageCarouselComponent } from '../components/car-image-carousel.component';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule, CarImageCarouselComponent],
  template: `
    <div class="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center mb-10">
           <h1 class="text-4xl font-serif font-bold text-slate-900">{{ t().nav.fleet }}</h1>
           <p class="text-slate-500 mt-2">Yüksekova yollarına uygun, güçlü ve konforlu araçlar.</p>
        </div>

        <!-- Search & Filters Container -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
            
            <!-- Search Bar -->
            <div class="mb-6 relative">
                <input 
                    type="text" 
                    [(ngModel)]="searchQuery" 
                    [placeholder]="t().buttons.search || 'Araç Ara (Marka, Model...)'"
                    class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                >
                <svg class="w-6 h-6 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
                
                <!-- Type Filters -->
                <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Araç Tipi Filtreleri">
                    <button (click)="filterType.set('All')" [attr.aria-pressed]="filterType() === 'All'" [class]="filterType() === 'All' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.all }}</button>
                    <button (click)="filterType.set('SUV')" [attr.aria-pressed]="filterType() === 'SUV'" [class]="filterType() === 'SUV' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.suv }}</button>
                    <button (click)="filterType.set('Pickup')" [attr.aria-pressed]="filterType() === 'Pickup'" [class]="filterType() === 'Pickup' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.pickup }}</button>
                    <button (click)="filterType.set('Sedan')" [attr.aria-pressed]="filterType() === 'Sedan'" [class]="filterType() === 'Sedan' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.sedan }}</button>
                    <button (click)="filterType.set('Hatchback')" [attr.aria-pressed]="filterType() === 'Hatchback'" [class]="filterType() === 'Hatchback' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.hatchback }}</button>
                    <button (click)="filterType.set('Luxury')" [attr.aria-pressed]="filterType() === 'Luxury'" [class]="filterType() === 'Luxury' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'" class="px-4 py-2 rounded-lg font-bold text-sm transition-all">{{ t().filters.luxury }}</button>
                </div>

                <!-- Advanced Filters & Sort -->
                <div class="flex flex-wrap gap-3 w-full lg:w-auto justify-center lg:justify-end">
                    
                    <!-- Fuel Filter -->
                    <select [(ngModel)]="filterFuel" class="bg-slate-100 border-none text-slate-700 py-2 px-4 pr-8 rounded-lg font-bold text-sm focus:ring-2 focus:ring-slate-900 cursor-pointer">
                        <option value="All">{{ t().car.fuel || 'Yakıt Tipi' }} ({{ t().filters.all }})</option>
                        <option value="Dizel">{{ t().car.diesel }}</option>
                        <option value="Benzin">{{ t().car.gasoline }}</option>
                        <option value="Hibrit">{{ t().car.hybrid }}</option>
                        <option value="Elektrik">{{ t().car.electric }}</option>
                    </select>

                    <!-- Transmission Filter -->
                    <select [(ngModel)]="filterTransmission" class="bg-slate-100 border-none text-slate-700 py-2 px-4 pr-8 rounded-lg font-bold text-sm focus:ring-2 focus:ring-slate-900 cursor-pointer">
                        <option value="All">{{ t().car.transmission || 'Vites' }} ({{ t().filters.all }})</option>
                        <option value="Otomatik">{{ t().car.auto }}</option>
                        <option value="Manuel">{{ t().car.manual }}</option>
                    </select>

                    <!-- Sort -->
                    <select [(ngModel)]="sortOption" class="bg-slate-100 border-none text-slate-700 py-2 px-4 pr-8 rounded-lg font-bold text-sm focus:ring-2 focus:ring-slate-900 cursor-pointer">
                        <option value="default">{{ t().sort.default }}</option>
                        <option value="priceAsc">{{ t().sort.priceAsc }}</option>
                        <option value="priceDesc">{{ t().sort.priceDesc }}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Driver Mode Indicator -->
        @if (withDriver()) {
            <div class="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-lg text-center text-amber-900 font-bold flex items-center justify-center shadow-sm animate-fade-in">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                {{ t().filters.driverActive }}
                <button (click)="withDriver.set(false)" class="ml-4 text-xs underline text-amber-700 hover:text-amber-900">{{ t().buttons.remove }}</button>
            </div>
        }

        <!-- Car Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           @for (car of sortedCars(); track car.id) {
              <div class="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-amber-200 overflow-hidden flex flex-col h-full group relative cursor-pointer" [class.opacity-75]="!car.isAvailable" (click)="goToDetail(car.id)">
                 
                 <!-- Availability Overlay if not available -->
                 @if (!car.isAvailable) {
                    <div class="absolute inset-0 z-20 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                        <span class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-xl transform -rotate-12 shadow-2xl border-2 border-white">{{ t().filters.rented }}</span>
                    </div>
                 }

                 <!-- Image -->
                 <div class="h-60 overflow-hidden relative bg-slate-200">
                    <app-car-image-carousel [images]="car.images || [car.image]" [altText]="car.model"></app-car-image-carousel>
                    
                    <!-- Badges -->
                    <div class="absolute top-4 left-4 flex gap-2 pointer-events-none z-20">
                        <div class="bg-white/90 backdrop-blur px-3 py-1 rounded-sm text-xs font-bold uppercase shadow-sm text-slate-900">
                            {{ translateDbValue(car.fuel, 'fuel') }}
                        </div>
                    </div>

                    <!-- Favorite Button -->
                    <button (click)="toggleFav($event, car.id)" [attr.aria-label]="isFav(car.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'" class="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center transition-all hover:scale-110 shadow-md hover:bg-white">
                         @if (isFav(car.id)) {
                            <svg class="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                         } @else {
                            <svg class="w-5 h-5 text-slate-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                         }
                    </button>
                 </div>
                 
                 <!-- Content -->
                 <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2">
                       <h3 class="text-xl font-bold text-slate-900 font-serif group-hover:text-amber-600 transition-colors">{{car.brand}} <span class="font-normal">{{car.model}}</span></h3>
                       <div class="text-right">
                           <span class="block text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{{car.price}} ₺ <span class="text-xs text-slate-400 font-normal group-hover:text-amber-400">/{{ t().car.day }}</span></span>
                       </div>
                    </div>
                    
                    <div class="flex gap-3 text-xs text-slate-500 mb-4">
                        <span class="bg-slate-100 px-2 py-1 rounded border border-slate-200 group-hover:border-amber-200 transition-colors">{{ translateDbValue(car.transmission, 'transmission') }}</span>
                        <span class="bg-slate-100 px-2 py-1 rounded border border-slate-200 group-hover:border-amber-200 transition-colors">{{car.seats}} {{ t().car.seats }}</span>
                        <span class="bg-slate-100 px-2 py-1 rounded border border-slate-200 group-hover:border-amber-200 transition-colors">{{ translateDbValue(car.type, 'type') }}</span>
                    </div>
                    
                    <div class="space-y-1 mb-6">
                        @for (feat of car.features.slice(0, 3); track feat) {
                            <div class="flex items-center text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> 
                                {{feat}}
                            </div>
                        }
                    </div>

                    <div class="mt-auto grid grid-cols-2 gap-3">
                        <button (click)="goToDetail(car.id); $event.stopPropagation()" class="bg-white border-2 border-slate-200 text-slate-900 hover:border-slate-900 font-bold py-3 rounded-lg transition-colors z-10 relative">
                            {{ t().buttons.details || 'Detaylar' }}
                        </button>
                        <button (click)="rentCar(car); $event.stopPropagation()" 
                                [disabled]="!car.isAvailable"
                                [attr.aria-label]="!car.isAvailable ? t().buttons.notAvailable : (withDriver() ? t().buttons.rentDriver : t().buttons.rent)"
                                class="bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex justify-center items-center disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500 z-10 relative">
                           <span>{{ !car.isAvailable ? t().buttons.notAvailable : (withDriver() ? t().buttons.rentDriver : t().buttons.rent) }}</span>
                        </button>
                    </div>
                 </div>
              </div>
           }
        </div>
      </div>
    </div>
  `
})
export class FleetComponent implements OnInit {
  carService = inject(CarService);
  uiService = inject(UiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  allCars = this.carService.getCars();
  
  // Filters
  searchQuery = signal('');
  filterType = signal('All');
  filterFuel = signal('All');
  filterTransmission = signal('All');
  sortOption = signal('default'); // default, priceAsc, priceDesc
  
  startDate = '';
  endDate = '';
  withDriver = signal(false);

  t = this.uiService.translations;

  sortedCars = computed(() => {
    let cars = this.allCars();

    // 1. Text Search
    const query = this.searchQuery().toLowerCase();
    if (query) {
        cars = cars.filter(c => 
            c.brand.toLowerCase().includes(query) || 
            c.model.toLowerCase().includes(query)
        );
    }

    // 2. Type Filter
    if (this.filterType() !== 'All') {
        cars = cars.filter(c => c.type === this.filterType());
    }

    // 3. Fuel Filter
    if (this.filterFuel() !== 'All') {
        cars = cars.filter(c => c.fuel === this.filterFuel());
    }

    // 4. Transmission Filter
    if (this.filterTransmission() !== 'All') {
        cars = cars.filter(c => c.transmission === this.filterTransmission());
    }

    // 5. Sorting
    if (this.sortOption() === 'priceAsc') {
       return [...cars].sort((a, b) => a.price - b.price);
    } else if (this.sortOption() === 'priceDesc') {
       return [...cars].sort((a, b) => b.price - a.price);
    }
    return cars;
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['start']) this.startDate = params['start'];
      if (params['end']) this.endDate = params['end'];
      if (params['driver'] === 'true') this.withDriver.set(true);
      if (params['filter']) this.filterType.set(params['filter']);
    });
  }

  toggleFav(event: Event, id: number) {
    event.stopPropagation();
    this.carService.toggleFavorite(id);
  }

  isFav(id: number) {
    return this.carService.isFavorite(id);
  }

  goToDetail(id: number) {
    this.router.navigate(['/fleet', id]);
  }

  rentCar(car: Car) {
    const request = {
      type: 'RENTAL' as const,
      item: car,
      itemName: `${car.brand} ${car.model} ${this.withDriver() ? '(Şoförlü)' : ''}`,
      image: car.image,
      basePrice: car.price, // Send daily price
      startDate: this.startDate,
      endDate: this.endDate,
      withDriver: this.withDriver()
    };

    this.carService.setBookingRequest(request);
    this.uiService.toggleContact(true);
  }

  translateDbValue(value: string, category: 'fuel' | 'transmission' | 'type'): string {
    const t = this.uiService.translations();
    // Map DB values (TR) to translation keys
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
