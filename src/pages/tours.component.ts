
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UiService } from '../services/ui.service';
import { CarService } from '../services/car.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-slate-50 min-h-screen font-sans text-slate-900">
      <!-- Sticky Module Header -->
      <div class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4">
          <div class="h-16 flex items-center gap-3">
            <button (click)="goBack()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 shrink-0" aria-label="Geri Dön">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1 class="text-lg font-bold text-slate-900">{{ t().home.tours.title }}</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (tour of tours; track tour.id) {
            <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group hover:shadow-2xl transition-all duration-500">
              <div class="relative h-64 overflow-hidden">
                <img [src]="tour.image" [alt]="tour.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerpolicy="no-referrer">
                <div class="absolute top-4 left-4 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  {{ tour.category }}
                </div>
                <!-- Favorite Button -->
                <button (click)="toggleFav($event, tour.id)" [attr.aria-label]="isFav(tour.id) ? t().common.removeFromFav : t().common.addToFav" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center transition-all hover:bg-white text-slate-700 hover:text-red-500 z-10">
                  <mat-icon [class.text-red-500]="isFav(tour.id)">{{ isFav(tour.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
                </button>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{{ tour.title }}</h3>
                <p class="text-slate-500 text-sm mb-6 line-clamp-2">{{ tour.description }}</p>
                
                <div class="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Kişi Başı</span>
                    <span class="text-2xl font-black text-slate-900">{{ tour.price }}₺</span>
                  </div>
                  <button (click)="bookTour(tour)" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-500 hover:text-slate-900 transition-all shadow-lg shadow-slate-200">
                    {{ t().home.tours.bookBtn }}
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
export class ToursComponent {
  uiService = inject(UiService);
  carService = inject(CarService);
  router = inject(Router);
  t = this.uiService.translations;

  tours = this.t().tours.list.map((t: any, i: number) => ({
      ...t,
      image: ['https://picsum.photos/seed/cilo/800/600', 'https://picsum.photos/seed/sat/800/600', 'https://picsum.photos/seed/culture/800/600'][i]
  }));

  goBack() {
    this.router.navigate(['/']);
  }

  toggleFav(event: Event, id: number) {
    event.stopPropagation();
    this.carService.toggleFavorite('tour-' + id);
  }

  isFav(id: number) {
    return this.carService.isFavorite('tour-' + id);
  }

  bookTour(tour: any) {
    this.uiService.toggleContact(true);
    // In a real app, we'd pass the tour info to the contact form
  }
}
