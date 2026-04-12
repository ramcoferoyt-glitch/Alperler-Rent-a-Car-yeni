import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <a [routerLink]="[variant === 'rental' ? '/fleet' : '/sales', car.id]" class="flex p-2 border-b border-slate-200 cursor-pointer hover:bg-slate-50 active:bg-slate-50 transition-colors bg-white w-full">
      <!-- Image -->
      <div class="w-[130px] h-[96px] md:w-[160px] md:h-[120px] shrink-0 relative mr-3 bg-slate-100 rounded-[2px] overflow-hidden">
        <img [src]="car.images?.[0] || car.image" 
             (error)="handleImageError($event)"
             [alt]="car.brand + ' ' + car.model" 
             class="w-full h-full object-cover" referrerpolicy="no-referrer">
        @if (car.badge) {
          <span class="absolute top-0 left-0 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br z-10">{{ car.badge }}</span>
        }
      </div>
      
      <!-- Content -->
      <div class="flex-grow flex flex-col justify-between py-0.5 min-w-0">
        <div>
          <!-- Title -->
          <div class="text-[13px] md:text-[15px] font-medium text-slate-800 leading-[1.3] line-clamp-2 uppercase">
            {{ car.title || (car.year + ' ' + car.brand + ' ' + car.model + ' ' + (car.series || '')) }}
          </div>
          
          <!-- Specs -->
          <div class="flex items-center gap-1.5 mt-1 text-[10px] md:text-[12px] text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            <span>{{ car.year }}</span>
            @if (car.km) {
              <span class="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
              <span>{{ car.km | number }} km</span>
            }
            @if (car.transmission) {
              <span class="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
              <span>{{ car.transmission }}</span>
            }
            @if (car.fuel) {
              <span class="w-1 h-1 rounded-full bg-slate-300 shrink-0 hidden sm:inline-block"></span>
              <span class="hidden sm:inline-block">{{ car.fuel }}</span>
            }
          </div>
        </div>

        <!-- Location & Price -->
        <div class="flex justify-between items-end mt-auto pt-1">
          <div class="flex flex-col">
            <span class="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium w-fit mb-1 border border-slate-200">{{ t().car.premiumGallery }}</span>
            <div class="flex items-center text-[10px] md:text-[12px] text-slate-500 truncate pr-2">
              <mat-icon class="text-[12px] w-[12px] h-[12px] mr-0.5 shrink-0">location_on</mat-icon>
              <span class="truncate">{{ t().car.location }}</span>
            </div>
          </div>
          <div class="text-[15px] md:text-[18px] font-bold text-[#2b5c92] whitespace-nowrap text-right">
            {{ (withDriver ? car.price + 1500 : car.price) | number }} TL
          </div>
        </div>
      </div>
    </a>
  `
})
export class VehicleCardComponent {
  uiService = inject(UiService);
  carService = inject(CarService);
  t = this.uiService.translations;

  @Input({ required: true }) car!: Car;
  @Input() variant: 'rental' | 'sale' = 'rental';
  @Input() withDriver = false;

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop';
  }

  showAllFeatures = signal(false);

  isFavorite() {
    return this.carService.isFavorite(this.car.id);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.carService.toggleFavorite(this.car.id);
  }

  toggleFeatures(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.showAllFeatures.update(v => !v);
  }

  shareVehicle(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: `${this.car.brand} ${this.car.model}`,
        text: `${this.car.year} model ${this.car.brand} ${this.car.model} Alperler'de!`,
        url: window.location.origin + (this.variant === 'rental' ? '/fleet/' : '/sales/') + this.car.id
      });
    }
  }

  get buttonText(): string {
    if (this.variant === 'rental') {
        if (!this.car.isAvailable) return this.t().buttons.notAvailable;
        if (this.withDriver) return this.t().buttons.rentDriver;
        return this.t().home.featured.bookBtn || 'HEMEN KİRALA';
    } else {
        return this.t().car.inspectNow || 'HEMEN AL';
    }
  }
}
