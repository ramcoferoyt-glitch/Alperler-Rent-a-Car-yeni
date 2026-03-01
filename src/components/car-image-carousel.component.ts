import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-image-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full group overflow-hidden bg-slate-200">
      <!-- Images -->
      @for (img of images(); track img; let i = $index) {
        <div class="absolute inset-0 transition-opacity duration-500 ease-in-out will-change-[opacity]"
             [class.opacity-100]="i === currentIndex()"
             [class.opacity-0]="i !== currentIndex()">
          <img [src]="img" [alt]="altText()" [loading]="i === 0 ? 'eager' : 'lazy'" class="object-cover w-full h-full">
        </div>
      }

      <!-- Controls (Only if multiple images) -->
      @if (images().length > 1) {
        <!-- Prev Button -->
        <button (click)="prev($event)" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <!-- Next Button -->
        <button (click)="next($event)" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <!-- Dots -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
           @for (img of images(); track img; let i = $index) {
              <button (click)="goTo($event, i)" class="w-2 h-2 rounded-full transition-all shadow-sm" 
                      [class.bg-white]="i === currentIndex()" 
                      [class.w-4]="i === currentIndex()"
                      [class.bg-white/50]="i !== currentIndex()"></button>
           }
        </div>
      }
    </div>
  `
})
export class CarImageCarouselComponent {
  images = input.required<string[]>();
  altText = input<string>('Car Image');
  
  currentIndex = signal(0);

  next(e: Event) {
    e.stopPropagation();
    this.currentIndex.update(i => (i + 1) % this.images().length);
  }

  prev(e: Event) {
    e.stopPropagation();
    this.currentIndex.update(i => (i - 1 + this.images().length) % this.images().length);
  }

  goTo(e: Event, index: number) {
    e.stopPropagation();
    this.currentIndex.set(index);
  }
}
