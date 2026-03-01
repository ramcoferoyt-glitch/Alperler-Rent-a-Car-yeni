
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, Tour } from '../../services/car.service';

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Tur Yönetimi</h1>
        <button (click)="openModal()" class="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-500 hover:text-slate-900 transition-colors shadow-lg flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Yeni Tur Ekle
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (tour of tours(); track tour.id) {
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                <div class="h-48 overflow-hidden relative">
                    <img [src]="tour.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                        {{tour.price}} ₺
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="font-bold text-lg text-slate-900 mb-2">{{tour.title}}</h3>
                    <p class="text-slate-500 text-sm mb-4 line-clamp-2">{{tour.description}}</p>
                    <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                        <span class="text-xs font-bold text-slate-400">{{tour.duration}}</span>
                        <div class="flex gap-2">
                            <button (click)="editTour(tour)" class="text-blue-500 hover:text-blue-700 font-bold text-sm">Düzenle</button>
                            <button (click)="deleteTour(tour.id)" class="text-red-500 hover:text-red-700 font-bold text-sm">Sil</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>

    <!-- Modal -->
    @if (isModalOpen()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 class="text-xl font-bold text-slate-900">{{ editingTour() ? 'Turu Düzenle' : 'Yeni Tur Ekle' }}</h2>
                    <button (click)="closeModal()" class="text-slate-400 hover:text-slate-900">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <form (submit)="saveTour($event)" class="p-6 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tur Başlığı</label>
                            <input type="text" [(ngModel)]="formTour.title" name="title" required class="w-full bg-slate-50 border border-slate-200 rounded p-3 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Süre</label>
                            <input type="text" [(ngModel)]="formTour.duration" name="duration" required placeholder="Örn: Tam Gün" class="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fiyat (₺)</label>
                            <input type="number" [(ngModel)]="formTour.price" name="price" required class="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Görsel URL</label>
                            <input type="text" [(ngModel)]="formTour.image" name="image" required class="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Açıklama</label>
                            <textarea [(ngModel)]="formTour.description" name="description" rows="3" required class="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:ring-2 focus:ring-amber-500 outline-none"></textarea>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Öne Çıkanlar (Virgülle ayırın)</label>
                            <input type="text" [ngModel]="highlightsString" (ngModelChange)="updateHighlights($event)" name="highlights" placeholder="Örn: Kahvaltı, Ulaşım, Rehberlik" class="w-full bg-slate-50 border border-slate-200 rounded p-3 focus:ring-2 focus:ring-amber-500 outline-none">
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex justify-end gap-4">
                        <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition-colors">İptal</button>
                        <button type="submit" class="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-500 hover:text-slate-900 transition-colors shadow-lg">
                            {{ editingTour() ? 'Güncelle' : 'Kaydet' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }
  `
})
export class AdminToursComponent {
  carService = inject(CarService);
  tours = this.carService.getTours();
  
  isModalOpen = signal(false);
  editingTour = signal<Tour | null>(null);
  
  formTour: Partial<Tour> = {};
  highlightsString = '';

  openModal() {
      this.isModalOpen.set(true);
      this.editingTour.set(null);
      this.formTour = { image: 'https://picsum.photos/800/600' };
      this.highlightsString = '';
  }

  editTour(tour: Tour) {
      this.isModalOpen.set(true);
      this.editingTour.set(tour);
      this.formTour = { ...tour };
      this.highlightsString = tour.highlights.join(', ');
  }

  closeModal() {
      this.isModalOpen.set(false);
  }

  updateHighlights(value: string) {
      this.highlightsString = value;
      this.formTour.highlights = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  saveTour(e: Event) {
      e.preventDefault();
      if (this.formTour.title && this.formTour.price) {
          this.carService.addTour(this.formTour as Tour);
          this.closeModal();
      }
  }

  deleteTour(id: number) {
      if(confirm('Bu turu silmek istediğinize emin misiniz?')) {
          this.carService.deleteTour(id);
      }
  }
}
