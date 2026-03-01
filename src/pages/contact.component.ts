
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService, BookingRequest } from '../services/car.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="font-sans relative z-[60]">
       
       <!-- ==========================
            FULL SCREEN CHECKOUT MODE
            ========================== -->
       @if (bookingData()) {
          <div class="fixed inset-0 bg-white z-[100] overflow-y-auto animate-fade-in">
             
             <!-- Checkout Header (Fixed) -->
             <div class="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-10 px-4 py-4 shadow-sm">
                 <div class="max-w-7xl mx-auto flex justify-between items-center">
                     <button (click)="clearBooking()" class="flex items-center text-slate-600 hover:text-slate-900 transition-colors font-bold">
                         <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                         Vazgeç ve Siteye Dön
                     </button>
                     <div class="font-serif font-bold text-xl text-slate-900">
                        {{ bookingData()?.type === 'RENTAL' ? 'GÜVENLİ ÖDEME & REZERVASYON' : 'TALEP OLUŞTURMA' }}
                     </div>
                     <!-- Close Button -->
                     <button (click)="clearBooking()" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                     </button>
                 </div>
             </div>

             <div class="max-w-7xl mx-auto px-4 py-12">
                 <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                     
                     <!-- LEFT: SUMMARY -->
                     <div class="lg:col-span-4 order-2 lg:order-1">
                        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-28">
                           <h3 class="font-bold text-slate-900 text-lg mb-4 pb-4 border-b border-slate-200">Sipariş Özeti</h3>
                           
                           <div class="aspect-video rounded-lg overflow-hidden bg-white mb-4 border border-slate-200">
                               <img [src]="bookingData()?.image" class="w-full h-full object-cover">
                           </div>
                           
                           <h4 class="text-xl font-serif font-bold text-slate-900 mb-1">{{ bookingData()?.itemName }}</h4>
                           <p class="text-slate-500 text-sm mb-6">{{ bookingData()?.type === 'RENTAL' ? 'Kiralama Hizmeti' : (bookingData()?.type === 'TOUR' ? 'Tur Hizmeti' : 'Satın Alma Talebi') }}</p>

                           @if(bookingData()?.type === 'RENTAL') {
                               <div class="space-y-3 mb-6">
                                   <!-- Rental Options -->
                                   <div class="grid grid-cols-2 gap-2">
                                       <div>
                                           <label class="text-xs font-bold text-slate-500 uppercase">Kiralama Türü</label>
                                           <select [(ngModel)]="rentalDuration" (change)="calculatePrice()" class="w-full bg-white border border-slate-200 rounded p-2 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                                               <option value="hourly_6">Saatlik (6 Saat)</option>
                                               <option value="hourly_12">Saatlik (12 Saat)</option>
                                               <option value="daily">Günlük</option>
                                               <option value="monthly">Aylık</option>
                                               <option value="longterm">Uzun Dönem</option>
                                           </select>
                                       </div>
                                       <div class="flex items-center justify-center bg-slate-100 rounded border border-slate-200">
                                           <label class="flex items-center space-x-2 cursor-pointer p-2">
                                               <input type="checkbox" [(ngModel)]="withDriver" (change)="calculatePrice()" class="form-checkbox h-4 w-4 text-amber-500 rounded focus:ring-amber-500">
                                               <span class="text-sm font-bold text-slate-700">Şoförlü Hizmet</span>
                                           </label>
                                       </div>
                                   </div>

                                   <div>
                                       <label class="text-xs font-bold text-slate-500 uppercase">Alış Tarihi</label>
                                       <input type="date" [(ngModel)]="startDate" (change)="calculatePrice()" class="w-full bg-white border border-slate-200 rounded p-2 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                                   </div>
                                   <div>
                                       <label class="text-xs font-bold text-slate-500 uppercase">Dönüş Tarihi</label>
                                       <input type="date" [(ngModel)]="endDate" (change)="calculatePrice()" class="w-full bg-white border border-slate-200 rounded p-2 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                                   </div>
                               </div>
                               
                               <div class="flex justify-between items-center text-sm text-slate-600 mb-2">
                                   <span>Günlük Fiyat</span>
                                   <span>{{ bookingData()?.basePrice | number }} ₺</span>
                               </div>
                               <div class="flex justify-between items-center text-sm text-slate-600 mb-4">
                                   <span>Süre</span>
                                   <span class="font-bold">
                                       @if(rentalDuration.startsWith('hourly')) {
                                           {{ rentalDuration === 'hourly_6' ? '6 Saat' : '12 Saat' }}
                                       } @else {
                                           {{ totalDays() }} Gün
                                       }
                                   </span>
                               </div>
                               <div class="border-t border-slate-200 pt-4 flex justify-between items-center">
                                   <span class="font-bold text-lg text-slate-900">Toplam Tutar</span>
                                   <span class="font-bold text-2xl text-amber-600">{{ totalPrice() | number }} ₺</span>
                               </div>
                           } @else {
                                <div class="border-t border-slate-200 pt-4 flex justify-between items-center">
                                   <span class="font-bold text-lg text-slate-900">Tahmini Bedel</span>
                                   <span class="font-bold text-2xl text-slate-900">{{ bookingData()?.basePrice | number }} ₺</span>
                               </div>
                           }
                        </div>
                     </div>

                     <!-- RIGHT: FORM & PAYMENT -->
                     <div class="lg:col-span-8 order-1 lg:order-2">
                         
                         <!-- SUCCESS SCREEN -->
                         @if (successMessage()) {
                             <div class="bg-green-50 border border-green-100 rounded-3xl p-12 text-center animate-fade-in-up">
                                 <div class="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
                                     <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                 </div>
                                 <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">İşleminiz Başarıyla Alındı!</h2>
                                 <p class="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">{{ successMessage() }}</p>
                                 
                                 <div class="bg-white p-6 rounded-xl border border-green-200 inline-block text-left mb-8">
                                     <p class="font-bold text-slate-900 mb-2">Rezervasyon Kodunuz:</p>
                                     <p class="text-2xl font-mono text-green-600 tracking-widest font-bold">ALP-{{ bookingCode() }}</p>
                                 </div>

                                 <div>
                                     <button (click)="resetFormAndGoHome()" class="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl transform hover:scale-105">
                                         Ana Sayfaya Dön
                                     </button>
                                 </div>
                             </div>
                         } 
                         
                         <!-- INPUT FORM -->
                         @else {
                             <div class="bg-white">
                                 <h2 class="text-2xl font-bold text-slate-900 mb-6">Kişisel Bilgiler</h2>
                                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                     <div class="space-y-2">
                                         <label for="name" class="text-xs font-bold text-slate-500 uppercase">Adınız <span class="text-red-500">*</span></label>
                                         <input id="name" type="text" [(ngModel)]="formName" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Örn: Ahmet">
                                     </div>
                                     <div class="space-y-2">
                                         <label for="surname" class="text-xs font-bold text-slate-500 uppercase">Soyadınız <span class="text-red-500">*</span></label>
                                         <input id="surname" type="text" [(ngModel)]="formSurname" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Örn: Yılmaz">
                                     </div>
                                     <div class="space-y-2">
                                         <label for="phone" class="text-xs font-bold text-slate-500 uppercase">Telefon Numarası <span class="text-red-500">*</span></label>
                                         <input id="phone" type="tel" [(ngModel)]="formPhone" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Örn: 0532 123 45 67">
                                     </div>
                                     <div class="space-y-2">
                                         <label for="email" class="text-xs font-bold text-slate-500 uppercase">E-Posta Adresi <span class="text-red-500">*</span></label>
                                         <input id="email" type="email" [(ngModel)]="formEmail" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Örn: ahmet@ornek.com">
                                     </div>
                                 </div>

                                 @if (bookingData()?.type === 'RENTAL') {
                                     <h2 class="text-2xl font-bold text-slate-900 mb-6">Ödeme Yöntemi</h2>
                                     
                                     <div class="flex flex-col md:flex-row gap-4 mb-8" role="radiogroup" aria-label="Ödeme Yöntemi Seçimi">
                                         <button (click)="paymentMethod.set('CREDIT_CARD')" role="radio" [attr.aria-checked]="paymentMethod() === 'CREDIT_CARD'" [class]="paymentMethod() === 'CREDIT_CARD' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="flex-1 p-6 rounded-xl transition-all flex flex-col items-center justify-center group">
                                             <svg class="w-8 h-8 mb-3" [class]="paymentMethod() === 'CREDIT_CARD' ? 'text-amber-500' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                             <span class="font-bold text-sm uppercase tracking-wider">Kredi Kartı</span>
                                         </button>
                                         
                                         <button (click)="paymentMethod.set('OFFICE')" role="radio" [attr.aria-checked]="paymentMethod() === 'OFFICE'" [class]="paymentMethod() === 'OFFICE' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="flex-1 p-6 rounded-xl transition-all flex flex-col items-center justify-center">
                                             <svg class="w-8 h-8 mb-3" [class]="paymentMethod() === 'OFFICE' ? 'text-amber-500' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                             <span class="font-bold text-sm uppercase tracking-wider">Ofiste Öde</span>
                                         </button>

                                         <button (click)="paymentMethod.set('EFT')" role="radio" [attr.aria-checked]="paymentMethod() === 'EFT'" [class]="paymentMethod() === 'EFT' ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'" class="flex-1 p-6 rounded-xl transition-all flex flex-col items-center justify-center">
                                             <svg class="w-8 h-8 mb-3" [class]="paymentMethod() === 'EFT' ? 'text-amber-500' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
                                             <span class="font-bold text-sm uppercase tracking-wider">Havale / EFT</span>
                                         </button>
                                     </div>

                                     <!-- CREDIT CARD FORM -->
                                     @if (paymentMethod() === 'CREDIT_CARD') {
                                        <div class="bg-slate-50 p-8 rounded-2xl border border-slate-200 animate-fade-in relative overflow-hidden">
                                            <div class="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">256-Bit SSL Güvenli Ödeme</div>
                                            
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div class="md:col-span-2">
                                                    <label for="cc-name" class="text-xs font-bold text-slate-500 uppercase block mb-2">Kart Üzerindeki İsim Soyisim</label>
                                                    <input id="cc-name" type="text" aria-label="Kart Üzerindeki İsim Soyisim" class="w-full bg-white border border-slate-300 p-4 rounded-lg font-bold uppercase placeholder-slate-300 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="AD SOYAD">
                                                </div>
                                                <div class="md:col-span-2">
                                                    <label for="cc-number" class="text-xs font-bold text-slate-500 uppercase block mb-2">Kart Numarası</label>
                                                    <div class="relative">
                                                       <input id="cc-number" type="text" aria-label="Kart Numarası" class="w-full bg-white border border-slate-300 p-4 rounded-lg font-mono font-bold text-lg placeholder-slate-300 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="0000 0000 0000 0000" maxlength="19">
                                                       <svg class="w-8 h-8 absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label for="cc-exp-month" class="text-xs font-bold text-slate-500 uppercase block mb-2">Son Kullanma Tarihi</label>
                                                    <div class="flex gap-2">
                                                        <select id="cc-exp-month" aria-label="Ay" class="flex-1 bg-white border border-slate-300 p-4 rounded-lg font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                                                            <option>Ay</option>
                                                            <option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option>
                                                            <option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option>
                                                        </select>
                                                        <select aria-label="Yıl" class="flex-1 bg-white border border-slate-300 p-4 rounded-lg font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                                                            <option>Yıl</option>
                                                            <option>2024</option><option>2025</option><option>2026</option><option>2027</option><option>2028</option><option>2029</option><option>2030</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label for="cc-cvv" class="text-xs font-bold text-slate-500 uppercase block mb-2">CVV Güvenlik Kodu</label>
                                                    <input id="cc-cvv" type="text" aria-label="CVV" class="w-full bg-white border border-slate-300 p-4 rounded-lg font-mono font-bold placeholder-slate-300 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="123" maxlength="3">
                                                </div>
                                            </div>
                                        </div>
                                     }

                                     <!-- OFFICE PAYMENT -->
                                     @if (paymentMethod() === 'OFFICE') {
                                         <div class="bg-blue-50 border border-blue-200 p-8 rounded-2xl text-center animate-fade-in">
                                             <p class="font-bold text-blue-900 text-lg mb-2">Ofiste Ödeme Seçildi</p>
                                             <p class="text-blue-700 text-sm">Rezervasyonunuz oluşturulacak. Araç tesliminde nakit veya kredi kartı ile ödeme yapabilirsiniz.</p>
                                         </div>
                                     }

                                     <!-- EFT PAYMENT -->
                                     @if (paymentMethod() === 'EFT') {
                                         <div class="bg-amber-50 border border-amber-200 p-8 rounded-2xl animate-fade-in">
                                             <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                                                 <div class="text-left">
                                                     <p class="font-bold text-amber-900 text-lg">Ziraat Bankası</p>
                                                     <p class="font-mono text-slate-700 font-bold text-xl tracking-wider my-2">TR12 0001 0002 0003 0004 0005 67</p>
                                                     <p class="text-sm text-slate-600 uppercase">ALICI: ALPERLER OTO KİRALAMA LTD. ŞTİ.</p>
                                                 </div>
                                                 <div class="bg-white p-4 rounded-lg border border-amber-100 text-xs text-slate-500 max-w-xs">
                                                     <p><strong>Önemli:</strong> Lütfen açıklama kısmına <strong>AD SOYAD</strong> yazınız. İşlem sonrası dekontu WhatsApp hattımıza iletiniz.</p>
                                                 </div>
                                             </div>
                                         </div>
                                     }

                                 }

                                 <button (click)="processBooking()" [disabled]="!isValidForm() || isSubmitting()" class="w-full mt-8 bg-slate-900 text-white py-6 rounded-xl font-bold text-xl uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center">
                                     @if(isSubmitting()) {
                                         <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                         {{ bookingData()?.type === 'RENTAL' && paymentMethod() === 'CREDIT_CARD' ? 'Banka ile İletişim Kuruluyor...' : 'İşlem Tamamlanıyor...' }}
                                     } @else {
                                         {{ bookingData()?.type === 'RENTAL' ? (paymentMethod() === 'CREDIT_CARD' ? 'Ödemeyi Onayla ve Bitir' : 'Rezervasyonu Tamamla') : 'Talebi Gönder' }}
                                     }
                                 </button>
                                 
                                 <p class="text-center text-xs text-slate-400 mt-4">"Tamamla" butonuna basarak <button (click)="openTerms()" class="underline cursor-pointer hover:text-slate-600 font-bold">Mesafeli Satış Sözleşmesi</button>'ni kabul etmiş olursunuz.</p>
                             </div>
                         }
                     </div>
                 </div>
             </div>
          </div>
       }

       <!-- ==========================
            STANDARD CONTACT PAGE (Non-Booking)
            ========================== -->
       @else {
           <div class="min-h-screen bg-slate-50 pt-0 font-sans relative z-50">
               
               <!-- Close Button -->
               <button (click)="close()" class="fixed top-6 right-6 z-50 bg-slate-900/10 hover:bg-slate-900 text-slate-900 hover:text-white rounded-full p-3 transition-all duration-300 shadow-lg border border-slate-900/10 group backdrop-blur-sm">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  <span class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Kapat</span>
               </button>

               <div class="relative bg-slate-900 h-[400px] flex items-center justify-center overflow-hidden mb-[-100px]">
                  <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div class="relative z-10 text-center">
                      <h1 class="font-serif text-5xl font-bold text-white mb-4">İletişim</h1>
                      <p class="text-slate-400 text-lg">7/24 Yanınızdayız</p>
                  </div>
               </div>

               <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
                   <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                     <!-- Left Column: Info & Map -->
                     <div class="space-y-8">
                        <div class="bg-slate-900 text-white p-8 rounded-xl shadow-lg">
                           <h3 class="font-serif text-xl font-bold mb-6 text-amber-500">İletişim Bilgileri</h3>
                           <ul class="space-y-6">
                              <li class="flex items-start">
                                 <svg class="w-5 h-5 text-amber-500 mr-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                 <span>{{ config().address }}</span>
                              </li>
                              <li class="flex items-center">
                                 <svg class="w-5 h-5 text-amber-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                 <span class="text-lg font-bold">{{ config().phone }}</span>
                              </li>
                              <li class="flex items-center">
                                 <svg class="w-5 h-5 text-amber-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                 <span>{{ config().email }}</span>
                              </li>
                           </ul>
                        </div>
                        <div class="bg-white p-2 rounded-xl shadow-lg h-[300px] overflow-hidden border border-slate-200">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50276.81582640637!2d44.26237087249756!3d37.55376989803086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40081211590d3409%3A0x972e3687221b8b2a!2zWcOca3Nla292YSwgSGFra2FyaQ!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                     </div>
                     <!-- Right Column: Contact Form -->
                     <div class="bg-white p-8 shadow-xl rounded-xl border-t-4 border-slate-900">
                        <h2 class="font-serif text-3xl font-bold text-slate-900 mb-2">Bize Ulaşın</h2>
                        <p class="text-slate-500 mb-8">Sorularınız veya talepleriniz için formu doldurun.</p>
                        <form (submit)="submitGeneralContact($event)" class="space-y-6">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                   <label for="contact-name" class="sr-only">Adınız</label>
                                   <input id="contact-name" type="text" [(ngModel)]="contactName" name="contactName" placeholder="Adınız" required class="w-full bg-slate-50 border border-slate-200 p-4 rounded-sm focus:ring-1 focus:ring-amber-500 outline-none transition-colors">
                               </div>
                               <div>
                                   <label for="contact-surname" class="sr-only">Soyadınız</label>
                                   <input id="contact-surname" type="text" [(ngModel)]="contactSurname" name="contactSurname" placeholder="Soyadınız" required class="w-full bg-slate-50 border border-slate-200 p-4 rounded-sm focus:ring-1 focus:ring-amber-500 outline-none transition-colors">
                               </div>
                           </div>
                           <div>
                               <label for="contact-phone" class="sr-only">Telefon</label>
                               <input id="contact-phone" type="tel" [(ngModel)]="contactPhone" name="contactPhone" placeholder="Telefon" required class="w-full bg-slate-50 border border-slate-200 p-4 rounded-sm focus:ring-1 focus:ring-amber-500 outline-none transition-colors">
                           </div>
                           <div>
                               <label for="contact-message" class="sr-only">Mesajınız</label>
                               <textarea id="contact-message" rows="4" [(ngModel)]="contactMessage" name="contactMessage" placeholder="Mesajınız" class="w-full bg-slate-50 border border-slate-200 p-4 rounded-sm focus:ring-1 focus:ring-amber-500 outline-none transition-colors"></textarea>
                           </div>
                           <button type="submit" [disabled]="!isValidContactForm()" class="w-full py-4 bg-slate-900 text-white font-bold uppercase tracking-widest shadow-lg hover:bg-amber-500 hover:text-slate-900 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">Gönder</button>
                        </form>
                     </div>
                  </div>
               </div>
           </div>
       }
    </div>
  `
})
export class ContactComponent implements OnInit {
  carService = inject(CarService);
  uiService = inject(UiService);
  router = inject(Router);
  config = this.carService.getConfig();
  
  bookingData = signal<BookingRequest | null>(null);

  close() {
      this.uiService.toggleContact(false);
  }
  
  // Form Fields
  formName = '';
  formSurname = '';
  formPhone = '';
  formEmail = ''; // Added Email
  
  // General Contact Form Fields
  contactName = '';
  contactSurname = '';
  contactPhone = '';
  contactMessage = '';

  // Rental Logic
  startDate = '';
  endDate = '';
  rentalDuration = 'daily'; // Default
  withDriver = false;
  totalDays = signal(0);
  totalPrice = signal(0);
  paymentMethod = signal<'CREDIT_CARD' | 'EFT' | 'OFFICE'>('CREDIT_CARD');

  // UI States
  isSubmitting = signal(false);
  successMessage = signal('');
  bookingCode = signal('');

  openTerms() {
      this.uiService.openLegal('terms');
  }

  ngOnInit() {
    const req = this.carService.getBookingRequest();
    if (req) {
      this.bookingData.set(req);
      if (req.startDate) this.startDate = req.startDate;
      if (req.endDate) this.endDate = req.endDate;
      if (req.rentalDuration) this.rentalDuration = req.rentalDuration;
      if (req.withDriver !== undefined) this.withDriver = req.withDriver;
      this.calculatePrice();
    }
  }

  calculatePrice() {
    const req = this.bookingData();
    if (req && req.type === 'RENTAL' && this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const timeDiff = end.getTime() - start.getTime();
        let days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (days < 1) days = 1; // Minimum 1 day/slot
        
        // Hourly Logic Adjustment
        let priceMultiplier = 1;
        let durationLabel = `${days} Gün`;

        if (this.rentalDuration.startsWith('hourly')) {
            // Hourly rentals are typically same-day, so we treat base calculation as 1 unit of the "hourly rate"
            // unless they span multiple days, which would be odd for "6 hours".
            // We'll assume the user means "I want a 6-hour rental on this day".
            days = 1; 
            
            if (this.rentalDuration === 'hourly_6') {
                priceMultiplier = 0.4; // 40% of daily price (Updated to be more realistic for 6h)
                durationLabel = '6 Saat';
            }
            if (this.rentalDuration === 'hourly_12') {
                priceMultiplier = 0.7; // 70% of daily price
                durationLabel = '12 Saat';
            }
        }

        // Driver Fee
        const driverFee = this.withDriver ? 1500 : 0; // 1500 TL per day for driver

        this.totalDays.set(days);
        
        // Base Price Calculation
        // If hourly, basePrice * multiplier. If daily, basePrice * days.
        let baseTotal = 0;
        if (this.rentalDuration.startsWith('hourly')) {
             baseTotal = (req.basePrice || 0) * priceMultiplier;
        } else {
             baseTotal = (req.basePrice || 0) * days;
        }

        // Add Driver Fee
        const totalDriverFee = driverFee * days;
        
        this.totalPrice.set(baseTotal + totalDriverFee);

        // Update UI Label (hacky but effective for this simple component)
        // We'll use a signal or just rely on the template using rentalDuration to show text
    }
  }

  clearBooking() {
    this.carService.clearBookingRequest();
    this.bookingData.set(null);
    this.resetLocalState();
    this.uiService.toggleContact(false);
  }

  isValidForm(): boolean {
      return !!(this.formName && this.formSurname && this.formPhone && this.formEmail);
  }

  processBooking() {
    if (!this.isValidForm()) return;

    this.isSubmitting.set(true);
    const req = this.bookingData()!;

    // Simulate Payment Processing Delay
    const delay = (req.type === 'RENTAL' && this.paymentMethod() === 'CREDIT_CARD') ? 2500 : 1500;

    setTimeout(() => {
        this.isSubmitting.set(false);
        
        // Generate unique booking code
        this.bookingCode.set(Math.floor(100000 + Math.random() * 900000).toString());

        // Construct Request
        const finalRequest: BookingRequest = {
            ...req,
            customerName: `${this.formName} ${this.formSurname}`,
            customerPhone: this.formPhone,
            customerEmail: this.formEmail,
            startDate: this.startDate,
            endDate: this.endDate,
            days: this.totalDays(),
            totalPrice: this.totalPrice() || req.basePrice,
            rentalDuration: this.rentalDuration,
            withDriver: this.withDriver
        };
        
        // Save to Service
        this.carService.addReservation(finalRequest);

        // Set Success Message based on Payment
        if (req.type === 'RENTAL') {
             if (this.paymentMethod() === 'CREDIT_CARD') {
                 this.successMessage.set(`Ödemeniz güvenli bir şekilde alındı. Araç teslimatı için ofisimizde bekleniyorsunuz.`);
             } else if (this.paymentMethod() === 'EFT') {
                 this.successMessage.set(`Havale bildiriminiz alındı. Lütfen ödeme dekontunu 0537 959 48 51 WhatsApp hattımıza iletiniz.`);
             } else {
                 this.successMessage.set(`Rezervasyonunuz oluşturuldu. Ödemeyi ofiste araç teslimi sırasında yapabilirsiniz.`);
             }
        } else {
            this.successMessage.set(`Talebiniz bize ulaştı. En kısa sürede ${this.formPhone} numarasından size dönüş yapılacaktır.`);
        }

    }, delay);
  }

  resetFormAndGoHome() {
      this.clearBooking();
      // clearBooking already closes the overlay
  }

  submitGeneralContact(e: Event) {
      e.preventDefault();
      if (!this.isValidContactForm()) return;

      const message = `[İLETİŞİM FORMU]
      Ad Soyad: ${this.contactName} ${this.contactSurname}
      Telefon: ${this.contactPhone}
      Mesaj: ${this.contactMessage}`;

      this.carService.sendNotification('admin@alperler.com', message);
      
      alert('Mesajınız iletildi! Teşekkürler.');
      
      // Reset Form
      this.contactName = '';
      this.contactSurname = '';
      this.contactPhone = '';
      this.contactMessage = '';
  }

  isValidContactForm(): boolean {
      return !!(this.contactName && this.contactSurname && this.contactPhone && this.contactMessage);
  }

  private resetLocalState() {
    this.formName = '';
    this.formSurname = '';
    this.formPhone = '';
    this.formEmail = '';
    this.successMessage.set('');
    this.bookingCode.set('');
    this.startDate = '';
    this.endDate = '';
  }
}
