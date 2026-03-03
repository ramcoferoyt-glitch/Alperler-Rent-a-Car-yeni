import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-list-your-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 pt-24 pb-12">
      <!-- Hero Section -->
      <div class="bg-slate-900 text-white py-16 mb-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Aracınızı Kiraya Verin, Ek Gelir Elde Edin</h1>
          <p class="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Kullanmadığınız zamanlarda aracınızı Alperler Rent A Car güvencesiyle kiraya verin. 
            Tüm süreçleri biz yönetelim, siz sadece kazancınıza odaklanın.
          </p>
          <div class="flex justify-center gap-8 text-slate-300">
            <div class="flex flex-col items-center">
              <mat-icon class="text-amber-500 mb-2" style="transform: scale(1.5);">security</mat-icon>
              <span>Tam Kapsamlı Sigorta</span>
            </div>
            <div class="flex flex-col items-center">
              <mat-icon class="text-amber-500 mb-2" style="transform: scale(1.5);">support_agent</mat-icon>
              <span>7/24 Destek</span>
            </div>
            <div class="flex flex-col items-center">
              <mat-icon class="text-amber-500 mb-2" style="transform: scale(1.5);">payments</mat-icon>
              <span>Düzenli Ödeme</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="p-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Başvuru Formu</h2>
            
            @if (submitSuccess()) {
              <div class="bg-emerald-50 text-emerald-800 p-6 rounded-xl text-center">
                <mat-icon class="text-emerald-500 mb-4" style="transform: scale(2);">check_circle</mat-icon>
                <h3 class="text-xl font-bold mb-2">Başvurunuz Alındı!</h3>
                <p>Aracınızı filomuza katmak için yaptığınız başvuru başarıyla bize ulaştı. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                <button (click)="resetForm()" class="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Yeni Başvuru Yap
                </button>
              </div>
            } @else {
              <form [formGroup]="partnerForm" (ngSubmit)="onSubmit()" class="space-y-6">
                
                <!-- Kişisel Bilgiler -->
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-slate-800 border-b pb-2">Kişisel Bilgiler</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Ad Soyad *</label>
                      <input type="text" formControlName="name" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Adınız Soyadınız">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Telefon *</label>
                      <input type="tel" formControlName="phone" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="05XX XXX XX XX">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                    <input type="email" formControlName="email" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="ornek@email.com">
                  </div>
                </div>

                <!-- Araç Bilgileri -->
                <div class="space-y-4 pt-4">
                  <h3 class="text-lg font-semibold text-slate-800 border-b pb-2">Araç Bilgileri</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Marka *</label>
                      <input type="text" formControlName="carBrand" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Örn: Renault">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Model *</label>
                      <input type="text" formControlName="carModel" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Örn: Megane">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Yıl *</label>
                      <input type="number" formControlName="carYear" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Örn: 2022">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Kilometre *</label>
                      <input type="number" formControlName="carMileage" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Örn: 45000">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Ek Notlar</label>
                    <textarea formControlName="notes" rows="3" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Aracınız hakkında eklemek istedikleriniz..."></textarea>
                  </div>
                </div>

                <!-- Legal Checkboxes -->
                <div class="space-y-3 pt-4 border-t border-slate-200">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" formControlName="acceptTerms" class="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500">
                    <span class="text-sm text-slate-600">
                      <a href="/legal/terms" target="_blank" class="text-amber-600 hover:underline">Kullanım Şartları</a>'nı okudum ve kabul ediyorum. *
                    </span>
                  </label>
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" formControlName="acceptKvkk" class="mt-1 w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500">
                    <span class="text-sm text-slate-600">
                      <a href="/legal/kvkk" target="_blank" class="text-amber-600 hover:underline">KVKK Aydınlatma Metni</a>'ni okudum ve kişisel verilerimin işlenmesini onaylıyorum. *
                    </span>
                  </label>
                </div>

                <div class="pt-6">
                  <button type="submit" [disabled]="!partnerForm.valid || isSubmitting()" 
                          class="w-full flex justify-center items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    @if (isSubmitting()) {
                      <mat-icon class="animate-spin">refresh</mat-icon>
                      Gönderiliyor...
                    } @else {
                      <mat-icon>send</mat-icon>
                      Başvuruyu Gönder
                    }
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class ListYourCarComponent {
  private fb = inject(FormBuilder);
  private carService = inject(CarService);

  isSubmitting = signal(false);
  submitSuccess = signal(false);

  partnerForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    carBrand: ['', Validators.required],
    carModel: ['', Validators.required],
    carYear: ['', [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear() + 1)]],
    carMileage: ['', Validators.required],
    notes: [''],
    acceptTerms: [false, Validators.requiredTrue],
    acceptKvkk: [false, Validators.requiredTrue]
  });

  async onSubmit() {
    if (this.partnerForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValue = this.partnerForm.value;
        const requestData = {
          name: formValue.name,
          phone: formValue.phone,
          email: formValue.email,
          carBrand: `${formValue.carBrand} ${formValue.carModel}`,
          modelYear: Number(formValue.carYear),
          km: Number(formValue.carMileage),
          description: formValue.notes || ''
        };
        
        await this.carService.submitPartnerRequest(requestData as any);
        this.submitSuccess.set(true);
      } catch (error) {
        console.error('Error submitting partner request:', error);
        alert('Başvuru gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya bizimle iletişime geçin.');
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Mark all as touched to show validation errors
      Object.keys(this.partnerForm.controls).forEach(key => {
        const control = this.partnerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm() {
    this.partnerForm.reset();
    this.submitSuccess.set(false);
  }
}
