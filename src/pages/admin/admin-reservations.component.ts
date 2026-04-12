
import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../services/car.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
        <h1 class="text-3xl font-bold text-slate-900">Rezervasyon Yönetimi</h1>
        
        <div class="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex">
            <button (click)="filter.set('ALL')" [class]="filter() === 'ALL' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2 rounded-md text-sm font-bold transition-all">Tümü</button>
            <button (click)="filter.set('PENDING')" [class]="filter() === 'PENDING' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2 rounded-md text-sm font-bold transition-all">Bekleyenler</button>
            <button (click)="filter.set('APPROVED')" [class]="filter() === 'APPROVED' ? 'bg-green-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2 rounded-md text-sm font-bold transition-all">Onaylananlar</button>
        </div>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
       <div class="overflow-x-auto">
           <table class="w-full text-left whitespace-nowrap">
              <thead class="bg-slate-900 text-white text-xs uppercase">
                 <tr>
                    <th class="px-6 py-4">ID</th>
                    <th class="px-6 py-4">Müşteri</th>
                    <th class="px-6 py-4">Telefon</th>
                    <th class="px-6 py-4">Hizmet</th>
                    <th class="px-6 py-4">Detay</th>
                    <th class="px-6 py-4">Tutar</th>
                    <th class="px-6 py-4">Durum</th>
                    <th class="px-6 py-4 text-right">İşlemler</th>
                 </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                 @for (res of filteredReservations(); track res.id) {
                    <tr class="hover:bg-slate-50 transition-colors">
                       <td class="px-6 py-4 font-mono text-xs text-slate-500">{{ res.id }}</td>
                       <td class="px-6 py-4 font-bold text-slate-900">{{ res.customerName }}</td>
                       <td class="px-6 py-4 text-sm">{{ res.customerPhone }}</td>
                       <td class="px-6 py-4">
                          <div class="font-bold">{{ res.itemName }}</div>
                          <div class="text-xs text-slate-500">{{ res.type }}</div>
                          @if(res.notes) {
                            <div class="text-xs text-amber-600 mt-1 whitespace-pre-line">{{ res.notes }}</div>
                          }
                       </td>
                       <td class="px-6 py-4 text-sm">
                          @if(res.days) { {{ res.days }} Gün <br> }
                          @if(res.startDate) { {{ res.startDate }} / {{ res.endDate }} }
                       </td>
                       <td class="px-6 py-4 font-bold text-green-600">{{ res.totalPrice || res.basePrice | number }} ₺</td>
                       <td class="px-6 py-4">
                          <span [class]="res.status === 'APPROVED' ? 'bg-green-100 text-green-800' : (res.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')" class="px-2 py-1 rounded-full text-xs font-bold">
                             {{ res.status === 'APPROVED' ? 'Onaylandı' : (res.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor') }}
                          </span>
                       </td>
                       <td class="px-6 py-4 text-right space-x-2">
                          @if (res.status === 'PENDING') {
                            <button (click)="updateStatus(res.id!, 'APPROVED')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold transition-transform hover:scale-105 shadow">Onayla</button>
                            <button (click)="updateStatus(res.id!, 'REJECTED')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition-transform hover:scale-105 shadow">Reddet</button>
                          } @else {
                            <span class="text-slate-400 text-xs italic mr-2">İşlem tamamlandı</span>
                            <button (click)="deleteReservation(res.id!)" class="bg-slate-200 hover:bg-red-500 hover:text-white text-slate-600 px-3 py-1 rounded text-xs font-bold transition-colors shadow">Sil</button>
                          }
                       </td>
                    </tr>
                 } @empty {
                     <tr><td colspan="8" class="px-6 py-12 text-center text-slate-500">
                        {{ filter() === 'ALL' ? 'Henüz bir talep bulunmuyor.' : 'Bu kriterde talep yok.' }}
                     </td></tr>
                 }
              </tbody>
           </table>
       </div>
    </div>
  `
})
export class AdminReservationsComponent implements OnInit {
  carService = inject(CarService);
  toastService = inject(ToastService);
  confirmService = inject(ConfirmService);
  route = inject(ActivatedRoute);
  reservations = this.carService.getReservations();
  
  filter = signal<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  typeFilter = signal<string | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.typeFilter.set(params['type']);
      } else {
        this.typeFilter.set(null);
      }
    });
  }

  filteredReservations = computed(() => {
     let current = this.reservations();
     if (this.typeFilter()) {
         current = current.filter(r => r.type === this.typeFilter());
     }
     if(this.filter() === 'ALL') return current;
     return current.filter(r => r.status === this.filter());
  });

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
      if (status === 'REJECTED') {
          const confirmed = await this.confirmService.confirm({
              title: 'Rezervasyonu Reddet',
              message: 'Bu rezervasyonu reddetmek istediğinize emin misiniz?'
          });
          if (!confirmed) return;
      }
      
      this.carService.updateReservationStatus(id, status);
      if (status === 'APPROVED') {
          this.toastService.show('Rezervasyon onaylandı.', 'success');
      } else {
          this.toastService.show('Rezervasyon reddedildi.', 'info');
      }
  }

  async deleteReservation(id: string) {
      const confirmed = await this.confirmService.confirm({
          title: 'Rezervasyonu Sil',
          message: 'Bu rezervasyonu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.'
      });
      if(confirmed) {
          this.carService.deleteReservation(id);
          this.toastService.show('Rezervasyon silindi.', 'info');
      }
  }
}
