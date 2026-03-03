import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, SaleCar } from '../../services/car.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in gap-4">
        <h1 class="text-3xl font-bold text-slate-900">Araç Yönetimi</h1>
        <div class="flex space-x-4 w-full md:w-auto">
            <button (click)="activeTab.set('RENTAL')" [class]="activeTab() === 'RENTAL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold shadow transition-colors text-center">Kiralık Filo</button>
            <button (click)="activeTab.set('SALES')" [class]="activeTab() === 'SALES' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'" class="flex-1 md:flex-none px-4 py-2 rounded-lg font-bold shadow transition-colors text-center">Galeri (Satılık)</button>
        </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
        <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
           <h3 class="font-bold text-slate-700">{{ activeTab() === 'RENTAL' ? 'Kiralık Araç Listesi' : 'Satılık Araç Listesi' }}</h3>
           <button (click)="openForm()" class="bg-amber-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-amber-600 shadow-md transition-all">+ Yeni Araç Ekle</button>
        </div>
        
        <!-- Add/Edit Form Overlay -->
        @if (showForm()) {
           <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                 <div class="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h4 class="font-bold text-xl text-slate-900">{{ isEditing ? 'Aracı Düzenle' : 'Yeni Araç Ekle' }} ({{ activeTab() === 'RENTAL' ? 'Kiralık' : 'Satılık' }})</h4>
                    <button (click)="closeForm()" class="text-slate-400 hover:text-red-500">
                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                 </div>
                 
                 <div class="p-6 space-y-6">
                    <!-- Image Upload Section -->
                    <div class="space-y-4">
                        <label class="block text-sm font-bold text-slate-700 uppercase">Araç Fotoğrafları (Max 10)</label>
                        
                        <!-- Main Image Preview -->
                        @if (currentCar.images && currentCar.images.length > 0) {
                            <div class="relative group rounded-xl overflow-hidden shadow-lg aspect-video bg-slate-100">
                                <img [src]="currentCar.images[activeImageIndex]" class="w-full h-full object-contain">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button (click)="removeImage(activeImageIndex)" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                                <div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    {{ activeImageIndex + 1 }} / {{ currentCar.images.length }}
                                </div>
                            </div>
                            
                            <!-- Thumbnails -->
                            <div class="flex gap-2 overflow-x-auto pb-2">
                                @for (img of currentCar.images; track $index) {
                                    <button (click)="activeImageIndex = $index" [class.ring-2]="activeImageIndex === $index" class="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 ring-amber-500">
                                        <img [src]="img" class="w-full h-full object-cover">
                                    </button>
                                }
                                
                                <!-- Add More Button -->
                                @if (currentCar.images.length < 10) {
                                    <div class="relative w-20 h-14 flex-shrink-0 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                                        <span class="text-2xl text-slate-400">+</span>
                                        <input type="file" (change)="onFileSelected($event)" accept="image/*" multiple class="absolute inset-0 opacity-0 cursor-pointer">
                                    </div>
                                }
                            </div>
                        } @else {
                            <div class="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                                <svg class="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="mt-1 text-sm text-slate-600 font-bold">Fotoğrafları Seç veya Sürükle</p>
                                <p class="text-xs text-slate-500">PNG, JPG, GIF (Max 5MB)</p>
                                <input type="file" (change)="onFileSelected($event)" accept="image/*" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                            </div>
                        }
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Marka</label>
                          <input [(ngModel)]="currentCar.brand" class="w-full p-3 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Model</label>
                          <input [(ngModel)]="currentCar.model" class="w-full p-3 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                       </div>
                       
                       @if (activeTab() === 'RENTAL') {
                           <div>
                              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Kasa Tipi</label>
                              <select [(ngModel)]="currentCar.type" class="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none">
                                 <option value="SUV">SUV</option>
                                 <option value="Sedan">Sedan</option>
                                 <option value="Pickup">Pickup</option>
                                 <option value="Hatchback">Hatchback</option>
                                 <option value="Luxury">Luxury</option>
                              </select>
                           </div>
                       } @else {
                           <div>
                              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Model Yılı</label>
                              <input [(ngModel)]="currentCar.year" type="number" class="w-full p-3 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                           </div>
                           <div>
                              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Kilometre (KM)</label>
                              <input [(ngModel)]="currentCar.km" type="number" class="w-full p-3 border rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                           </div>
                       }

                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fiyat (TL)</label>
                          <input [(ngModel)]="currentCar.price" type="number" class="w-full p-3 border rounded-lg bg-slate-50 font-bold text-green-600 focus:ring-2 focus:ring-amber-500 outline-none">
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Yakıt</label>
                          <select [(ngModel)]="currentCar.fuel" class="w-full p-3 border rounded-lg bg-slate-50">
                             <option value="Dizel">Dizel</option>
                             <option value="Benzin">Benzin</option>
                             <option value="Hibrit">Hibrit</option>
                             <option value="Elektrik">Elektrik</option>
                          </select>
                       </div>
                       <div>
                          <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Vites</label>
                          <select [(ngModel)]="currentCar.transmission" class="w-full p-3 border rounded-lg bg-slate-50">
                             <option value="Otomatik">Otomatik</option>
                             <option value="Manuel">Manuel</option>
                          </select>
                       </div>
                       
                       @if (activeTab() === 'RENTAL') {
                           <div class="md:col-span-2">
                              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Araç Durumu</label>
                              <div class="flex gap-4">
                                 <button (click)="currentCar.isAvailable = true" [class]="currentCar.isAvailable ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-slate-100 text-slate-400'" class="flex-1 py-3 rounded-lg font-bold transition-all">
                                    Müsait
                                 </button>
                                 <button (click)="currentCar.isAvailable = false" [class]="!currentCar.isAvailable ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-slate-100 text-slate-400'" class="flex-1 py-3 rounded-lg font-bold transition-all">
                                    Dolu / Kirada
                                 </button>
                              </div>
                           </div>
                       } @else {
                           <div class="md:col-span-2">
                              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ekspertiz / Açıklama</label>
                              <textarea [(ngModel)]="currentCar.description" rows="3" class="w-full p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-amber-500 outline-none"></textarea>
                           </div>
                       }
                    </div>
                 </div>
                 
                 <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl sticky bottom-0">
                    <button (click)="closeForm()" class="px-6 py-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">İptal</button>
                    <button (click)="saveCar()" class="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:bg-amber-500 hover:text-slate-900 transition-all">
                       {{ isEditing ? 'Değişiklikleri Kaydet' : 'Aracı Ekle' }}
                    </button>
                 </div>
              </div>
           </div>
        }

        <div class="overflow-x-auto">
           <table class="w-full text-left whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-500 text-xs uppercase">
                 <tr>
                    <th class="px-6 py-3">Resim</th>
                    <th class="px-6 py-3">Marka/Model</th>
                    <th class="px-6 py-3">Detay</th>
                    <th class="px-6 py-3">Fiyat</th>
                    <th class="px-6 py-3">Durum</th>
                    <th class="px-6 py-3 text-right">İşlemler</th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                 @if (activeTab() === 'RENTAL') {
                     @for (car of cars(); track car.id) {
                        <tr class="hover:bg-slate-50 transition-colors group">
                           <td class="px-6 py-3">
                              <img [src]="car.image || (car.images && car.images[0])" class="w-16 h-12 object-cover rounded shadow-sm border border-slate-200">
                           </td>
                           <td class="px-6 py-3 font-bold text-slate-900">{{ car.brand }} {{ car.model }}</td>
                           <td class="px-6 py-3 text-sm text-slate-500">
                              <span class="bg-slate-100 px-2 py-1 rounded border">{{ car.type }}</span>
                           </td>
                           <td class="px-6 py-3 font-bold text-slate-900">{{ car.price }} ₺</td>
                           <td class="px-6 py-3">
                              <span [class]="car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 rounded text-xs font-bold inline-flex items-center">
                                 <span class="w-2 h-2 rounded-full mr-2" [class]="car.isAvailable ? 'bg-green-500' : 'bg-red-500'"></span>
                                 {{ car.isAvailable ? 'Müsait' : 'Dolu' }}
                              </span>
                           </td>
                           <td class="px-6 py-3 text-right space-x-2">
                              <button (click)="editCar(car)" class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                 Düzenle
                              </button>
                              <button (click)="deleteCar(car.id)" class="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                 Sil
                              </button>
                           </td>
                        </tr>
                     }
                 } @else {
                     @for (car of saleCars(); track car.id) {
                        <tr class="hover:bg-slate-50 transition-colors group">
                           <td class="px-6 py-3">
                              <img [src]="car.image || (car.images && car.images[0])" class="w-16 h-12 object-cover rounded shadow-sm border border-slate-200">
                           </td>
                           <td class="px-6 py-3 font-bold text-slate-900">{{ car.brand }} {{ car.model }}</td>
                           <td class="px-6 py-3 text-sm text-slate-500">
                              {{ car.year }} / {{ car.km }} KM
                           </td>
                           <td class="px-6 py-3 font-bold text-slate-900">{{ car.price | number }} ₺</td>
                           <td class="px-6 py-3">
                              <span class="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">Satılık</span>
                           </td>
                           <td class="px-6 py-3 text-right space-x-2">
                              <button (click)="editCar(car)" class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                 Düzenle
                              </button>
                              <button (click)="deleteCar(car.id)" class="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                 Sil
                              </button>
                           </td>
                        </tr>
                     }
                 }
              </tbody>
           </table>
        </div>
    </div>
  `
})
export class AdminCarsComponent implements OnInit {
  carService = inject(CarService);
  toastService = inject(ToastService);
  router = inject(Router);
  
  cars = this.carService.getCars();
  saleCars = this.carService.getSaleCars();

  activeTab = signal<'RENTAL' | 'SALES'>('RENTAL');
  showForm = signal(false);
  isEditing = false;
  activeImageIndex = 0;

  ngOnInit() {
      if (this.router.url.includes('sales')) {
          this.activeTab.set('SALES');
      }
  }

  // Default Models
  defaultRentalCar = {
     id: 0,
     brand: '', 
     model: '', 
     price: 0, 
     type: 'SUV', 
     image: '', 
     images: [] as string[],
     seats: 5, 
     features: ['Klima', 'Bluetooth', 'ABS'], 
     isAvailable: true, 
     fuel: 'Dizel', 
     transmission: 'Otomatik'
  };

  defaultSaleCar: any = {
      id: 0,
      brand: '',
      model: '',
      year: 2023,
      km: 0,
      price: 0,
      image: '',
      images: [] as string[],
      description: '',
      features: [],
      transmission: 'Otomatik',
      fuel: 'Dizel'
  };

  currentCar: any = { ...this.defaultRentalCar };

  openForm() {
      this.isEditing = false;
      this.currentCar = this.activeTab() === 'RENTAL' ? { ...this.defaultRentalCar, images: [] } : { ...this.defaultSaleCar, images: [] };
      this.activeImageIndex = 0;
      this.showForm.set(true);
  }

  closeForm() {
      this.showForm.set(false);
  }

  editCar(car: any) {
      this.isEditing = true;
      this.currentCar = { ...car }; // Clone
      // Ensure images array exists
      if (!this.currentCar.images) {
          this.currentCar.images = this.currentCar.image ? [this.currentCar.image] : [];
      }
      this.activeImageIndex = 0;
      this.showForm.set(true);
  }

  onFileSelected(event: any) {
      const files = event.target.files;
      if (files && files.length > 0) {
          // Initialize images array if it doesn't exist
          if (!this.currentCar.images) {
              this.currentCar.images = [];
          }

          // Process each file
          for (let i = 0; i < files.length; i++) {
              if (this.currentCar.images.length >= 10) {
                  this.toastService.show('En fazla 10 fotoğraf yükleyebilirsiniz.', 'error');
                  break;
              }

              const reader = new FileReader();
              reader.onload = (e: any) => {
                  this.currentCar.images.push(e.target.result);
                  // Set main image if it's the first one
                  if (this.currentCar.images.length === 1) {
                      this.currentCar.image = e.target.result;
                  }
              };
              reader.readAsDataURL(files[i]);
          }
      }
  }

  removeImage(index: number) {
      this.currentCar.images.splice(index, 1);
      // Update main image
      if (this.currentCar.images.length > 0) {
          this.currentCar.image = this.currentCar.images[0];
          if (this.activeImageIndex >= this.currentCar.images.length) {
              this.activeImageIndex = this.currentCar.images.length - 1;
          }
      } else {
          this.currentCar.image = '';
          this.activeImageIndex = 0;
      }
  }

  saveCar() {
      if (!this.currentCar.brand || !this.currentCar.model || !this.currentCar.price) {
          this.toastService.show('Lütfen Marka, Model ve Fiyat alanlarını doldurun.', 'error');
          return;
      }
      
      // Ensure main image is set from images array
      if (this.currentCar.images && this.currentCar.images.length > 0) {
          this.currentCar.image = this.currentCar.images[0];
      } else if (!this.currentCar.image) {
          // Fallback placeholder
          this.currentCar.image = `https://picsum.photos/seed/${this.currentCar.brand}/800/600`;
          this.currentCar.images = [this.currentCar.image];
      }

      if (this.activeTab() === 'RENTAL') {
          this.carService.addCar(this.currentCar);
      } else {
          this.carService.addSaleCar(this.currentCar);
      }
      
      this.toastService.show(this.isEditing ? 'Araç güncellendi.' : 'Yeni araç eklendi.', 'success');
      this.closeForm();
  }

  deleteCar(id: number) {
      if(confirm('Bu aracı silmek istediğinize emin misiniz?')) {
          if (this.activeTab() === 'RENTAL') {
              this.carService.deleteCar(id);
          } else {
              this.carService.deleteSaleCar(id);
          }
          this.toastService.show('Araç silindi.', 'info');
      }
  }
}
