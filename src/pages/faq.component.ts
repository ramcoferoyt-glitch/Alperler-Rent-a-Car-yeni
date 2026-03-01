
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
           <h1 class="font-serif text-4xl font-bold text-slate-900 mb-4">Sıkça Sorulan Sorular</h1>
           <p class="text-slate-500">Aklınıza takılan tüm soruların cevapları burada.</p>
        </div>

        <div class="space-y-4">
           @for (faq of faqs(); track faq.id) {
              <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group">
                 <button (click)="toggleFaq(faq.id)" class="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-white hover:bg-slate-50 transition-colors">
                    <span class="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">{{ faq.question }}</span>
                    <span class="text-slate-400 transform transition-transform duration-300 bg-slate-100 rounded-full p-1" [class.rotate-180]="faq.isOpen">
                       <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                 </button>
                 <div class="bg-slate-50 text-slate-600 leading-relaxed overflow-hidden transition-all duration-300" 
                      [style.max-height]="faq.isOpen ? '500px' : '0'"
                      [style.opacity]="faq.isOpen ? '1' : '0'">
                    <div class="p-6 pt-0 border-t border-slate-100 mt-2">
                       {{ faq.answer }}
                    </div>
                 </div>
              </div>
           }
        </div>
      </div>
    </div>
  `
})
export class FaqComponent {
  carService = inject(CarService);
  faqs = this.carService.getFaqs();

  toggleFaq(id: number) {
    // We need to update the local state or service state. 
    // Since isOpen is UI state, we can handle it by mutating a local copy or updating the service if we want persistence of open state (unlikely).
    // Better approach for signals: create a local signal or just update the object in the array if it's mutable enough for this view.
    // However, signals are immutable by default.
    // Let's just use a local set of open IDs.
    this.carService.addFaq({ ...this.faqs().find(f => f.id === id)!, isOpen: !this.faqs().find(f => f.id === id)!.isOpen });
  }
}
