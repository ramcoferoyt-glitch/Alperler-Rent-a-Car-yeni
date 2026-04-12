
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../services/car.service';
import { Car } from '../models/car.model';
import { UiService } from '../services/ui.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CarImageCarouselComponent } from '../components/car-image-carousel.component';
import { LightboxComponent } from '../components/lightbox.component';
import { VehicleCardComponent } from '../components/vehicle-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, FormsModule, MatIconModule, LightboxComponent, VehicleCardComponent],
  template: `
    <!-- Hero Section -->
    <div class="relative h-[85vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden group">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
         <img ngSrc="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" fill priority alt="Hero Image" class="object-cover brightness-75">
         <div class="absolute inset-0 bg-black/40"></div>
      </div>
      
      <!-- Hero Content (User's Text) -->
      <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-16">
        <div class="animate-fade-in-up space-y-6">
          
          <h1 class="font-serif text-4xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
            {{ t().hero.title }}
          </h1>
          
          <p class="text-base md:text-xl text-white/95 max-w-3xl mx-auto font-medium drop-shadow-md leading-relaxed px-4">
            {{ t().hero.subtitle }}
          </p>

          <div class="pt-4">
              <button (click)="scrollToBooking()" class="bg-white text-slate-900 hover:bg-amber-500 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl transform hover:scale-105">
                  {{ t().hero.cta }}
              </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Engine -->
    <div id="bookingArea" class="relative z-20 max-w-6xl mx-auto px-4 -mt-24 mb-16">
        <div class="bg-white rounded-xl shadow-2xl p-6 md:p-8 border-b-4 border-amber-500">
            <h3 class="text-slate-800 font-bold text-lg mb-6 flex items-center border-b border-slate-100 pb-4">
                <svg class="w-6 h-6 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ t().home.booking.title }}
            </h3>
            <form (submit)="searchCars($event)" class="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                <!-- Hizmet Türü (Dropdown) -->
                <div class="space-y-1 md:col-span-1">
                    <label for="service-type" class="text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t().home.booking.type }}</label>
                    <div class="relative">
                        <select id="service-type" [(ngModel)]="serviceType" name="serviceType" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer">
                            <option value="individual">{{ t().home.booking.types.individual }}</option>
                            <option value="driver">{{ t().home.booking.types.driver }}</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <!-- Kiralama Süresi (Dropdown) -->
                <div class="space-y-1 md:col-span-1">
                    <label for="rental-duration" class="text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t().home.booking.duration }}</label>
                    <div class="relative">
                        <select id="rental-duration" [(ngModel)]="rentalDuration" name="rentalDuration" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer">
                            <option value="hourly_6">{{ t().home.booking.durations.hourly_6 }}</option>
                            <option value="hourly_12">{{ t().home.booking.durations.hourly_12 }}</option>
                            <option value="daily">{{ t().home.booking.durations.daily }}</option>
                            <option value="monthly">{{ t().home.booking.durations.monthly }}</option>
                            <option value="longterm">{{ t().home.booking.durations.longterm }}</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div class="space-y-1 md:col-span-1">
                    <label for="pickup-location" class="text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t().home.booking.pickup }}</label>
                    <div class="relative">
                        <select id="pickup-location" [(ngModel)]="pickupLocation" name="location" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer">
                            <option value="merkez">{{ t().home.booking.locations.center }}</option>
                            <option value="havalimani">{{ t().home.booking.locations.airport }}</option>
                            <option value="otogar">{{ t().home.booking.locations.bus }}</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
                <div class="space-y-1 md:col-span-1">
                    <label for="pickup-date" class="text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t().home.booking.startDate }}</label>
                    <input id="pickup-date" type="date" [(ngModel)]="pickupDate" name="startDate" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold">
                </div>
                <div class="space-y-1 md:col-span-1">
                    <label for="return-date" class="text-xs font-bold text-slate-500 uppercase tracking-wide">{{ t().home.booking.endDate }}</label>
                    <input id="return-date" type="date" [(ngModel)]="returnDate" name="endDate" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold">
                </div>
                <div class="flex items-end md:col-span-1">
                    <button type="submit" class="w-full bg-slate-900 hover:bg-amber-500 hover:text-white text-white font-bold h-[46px] rounded-lg transition-all uppercase tracking-wider text-xs shadow-lg flex items-center justify-center">
                        {{ t().home.booking.searchBtn }}
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Featured Vehicles (Rental) -->
    <section class="py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-16">
                <div class="max-w-2xl">
                    <span class="text-amber-600 font-bold tracking-[0.3em] uppercase text-[10px] block mb-3">{{ t().home.featured.badge }}</span>
                    <h2 class="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">{{ t().home.featured.title }}</h2>
                    <p class="text-slate-500 mt-4 text-lg font-light">{{ t().home.featured.subtitle }}</p>
                </div>
            </div>

            <div class="max-w-4xl mx-auto mb-12 bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                @for(car of featuredCars(); track car.id) {
                    <app-vehicle-card 
                        [car]="car" 
                        variant="rental">
                    </app-vehicle-card>
                }
            </div>

            <div class="text-center">
                <a routerLink="/fleet" class="inline-flex items-center justify-center px-10 py-5 bg-slate-900 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl hover:scale-105 transform">
                    {{ t().home.featured.viewAll }}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
        </div>
    </section>

    <!-- Sales Teaser Section -->
    <section class="py-24 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="mb-16">
                <div class="max-w-2xl">
                    <span class="text-amber-600 font-bold tracking-[0.3em] uppercase text-[10px] block mb-3">{{ t().home.sales.badge }}</span>
                    <h2 class="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">{{ t().home.sales.title }}</h2>
                    <p class="text-slate-500 mt-4 text-lg font-light">{{ t().home.sales.description }}</p>
                </div>
            </div>

            <div class="max-w-4xl mx-auto mb-12 bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                @for(car of featuredSaleCars(); track car.id) {
                    <app-vehicle-card 
                        [car]="car" 
                        variant="sale">
                    </app-vehicle-card>
                }
            </div>

            <div class="text-center">
                <a routerLink="/sales" class="inline-flex items-center justify-center px-10 py-5 bg-slate-900 text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl hover:scale-105 transform">
                    {{ t().home.sales.viewAll }}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
        </div>
    </section>

    <!-- Why Us? (User's Specific Text) -->
    <section class="py-20 bg-slate-50 border-t border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto text-center mb-16">
            <h2 class="text-4xl font-serif font-bold text-slate-900 mb-6">{{ t().home.whyUs.title }}</h2>
                <p class="text-lg text-slate-600 leading-relaxed">
                    {{ t().home.whyUs.subtitle }}
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div class="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group">
                    <div class="w-20 h-20 bg-slate-50 shadow-md text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h3 class="font-bold text-xl text-slate-900 mb-3">{{ t().home.whyUs.features.trust.title }}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">
                       {{ t().home.whyUs.features.trust.desc }}
                    </p>
                </div>
                
                <div class="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group">
                    <div class="w-20 h-20 bg-slate-50 shadow-md text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 class="font-bold text-xl text-slate-900 mb-3">{{ t().home.whyUs.features.support.title }}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">
                       {{ t().home.whyUs.features.support.desc }}
                    </p>
                </div>

                <div class="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 group">
                    <div class="w-20 h-20 bg-slate-50 shadow-md text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h3 class="font-bold text-xl text-slate-900 mb-3">{{ t().home.whyUs.features.comfort.title }}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed">
                       {{ t().home.whyUs.features.comfort.desc }}
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Partner (Rent Your Car) - Extended Form -->
    <section id="partnerForm" class="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 class="font-serif text-3xl md:text-4xl font-bold text-white mb-6">{{ t().home.partner.title }}</h2>
                        <p class="text-slate-300 mb-8 text-lg leading-relaxed">
                            {{ t().home.partner.subtitle }}
                        </p>
                        
                        <div class="bg-white/5 p-8 rounded-2xl border border-white/10 mb-6">
                            <h4 class="font-bold text-amber-400 text-xl mb-4 flex items-center">
                                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                {{ t().home.partner.requirements.title }}
                            </h4>
                            <ul class="space-y-4">
                                <li class="flex items-center text-white font-bold text-lg">
                                    <span class="w-3 h-3 bg-red-500 rounded-full mr-4 shadow-[0_0_10px_red]"></span>
                                    {{ t().home.partner.requirements.year }}
                                </li>
                                <li class="flex items-center text-slate-300">
                                    <span class="w-2 h-2 bg-amber-500 rounded-full mr-4"></span>
                                    {{ t().home.partner.requirements.damage }}
                                </li>
                                <li class="flex items-center text-slate-300">
                                    <span class="w-2 h-2 bg-amber-500 rounded-full mr-4"></span>
                                    {{ t().home.partner.requirements.maintenance }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-2xl shadow-xl text-slate-900">
                        <h3 class="font-bold text-2xl mb-6 text-slate-900 border-b pb-4">{{ t().home.partner.form.title }}</h3>
                        @if (rentCarFormSent()) {
                           <div class="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center">
                               <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                               </div>
                               <h4 class="font-bold text-lg mb-2">{{ t().home.partner.form.success.title }}</h4>
                               <p>{{ t().home.partner.form.success.message }}</p>
                           </div>
                        } @else {
                           <form #partnerForm="ngForm" (ngSubmit)="submitRentCarForm(partnerForm)" class="space-y-4">
                               <div class="grid grid-cols-2 gap-4">
                                   <div class="space-y-1">
                                       <label for="partnerName" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.name }}</label>
                                       <input type="text" id="partnerName" name="name" ngModel required #nameCtrl="ngModel" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" [class.border-red-500]="nameCtrl.invalid && nameCtrl.touched">
                                       @if (nameCtrl.invalid && nameCtrl.touched) {
                                           <p class="text-red-500 text-xs mt-1">{{ t().home.partner.form.errors.name }}</p>
                                       }
                                   </div>
                                   <div class="space-y-1">
                                       <label for="partnerPhone" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.phone }}</label>
                                       <input type="tel" id="partnerPhone" name="phone" ngModel required pattern="[0-9]{10,11}" #phoneCtrl="ngModel" placeholder="05XX XXX XX XX" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" [class.border-red-500]="phoneCtrl.invalid && phoneCtrl.touched">
                                       @if (phoneCtrl.invalid && phoneCtrl.touched) {
                                           <p class="text-red-500 text-xs mt-1">{{ t().home.partner.form.errors.phone }}</p>
                                       }
                                   </div>
                               </div>
                               <div class="space-y-1">
                                   <label for="partnerEmail" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.email || 'E-posta Adresi' }}</label>
                                   <input type="email" id="partnerEmail" name="email" ngModel required email #emailCtrl="ngModel" placeholder="ornek@mail.com" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" [class.border-red-500]="emailCtrl.invalid && emailCtrl.touched">
                                   @if (emailCtrl.invalid && emailCtrl.touched) {
                                       <p class="text-red-500 text-xs mt-1">{{ t().home.partner.form.errors.email || 'Lütfen geçerli bir e-posta adresi giriniz.' }}</p>
                                   }
                               </div>

                              <div class="grid grid-cols-2 gap-4">
                                  <div class="space-y-1">
                                      <label for="partnerCarBrand" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.car }}</label>
                                      <input type="text" id="partnerCarBrand" name="carBrand" ngModel required #brandCtrl="ngModel" placeholder="Örn: VW Passat" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" [class.border-red-500]="brandCtrl.invalid && brandCtrl.touched">
                                      @if (brandCtrl.invalid && brandCtrl.touched) {
                                          <p class="text-red-500 text-xs mt-1">{{ t().home.partner.form.errors.car }}</p>
                                      }
                                  </div>
                                  <div class="space-y-1">
                                      <label for="partnerModelYear" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.year }}</label>
                                      <select id="partnerModelYear" name="modelYear" ngModel="2024" required #yearCtrl="ngModel" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
                                          <option value="2024">2024</option>
                                          <option value="2023">2023</option>
                                          <option value="2022">2022</option>
                                          <option value="2021">2021</option>
                                          <option value="2020">2020</option>
                                          <option value="2019">2019</option>
                                          <option value="2018">2018</option>
                                      </select>
                                  </div>
                              </div>

                              <div class="space-y-1">
                                  <label for="partnerKm" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.km }}</label>
                                  <input type="number" id="partnerKm" name="km" ngModel required min="0" #kmCtrl="ngModel" placeholder="Örn: 50000" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" [class.border-red-500]="kmCtrl.invalid && kmCtrl.touched">
                                  @if (kmCtrl.invalid && kmCtrl.touched) {
                                      <p class="text-red-500 text-xs mt-1">{{ t().home.partner.form.errors.km }}</p>
                                  }
                              </div>

                              <div class="space-y-1">
                                  <label for="partnerFiles" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.photos }}</label>
                                  <div class="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500">
                                      <input type="file" id="partnerFiles" multiple accept="image/*,video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Araç fotoğrafları veya videoları yükleyin">
                                      <div class="text-slate-500 pointer-events-none">
                                          <svg class="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                          <span class="text-xs font-bold text-amber-600">{{ t().home.partner.form.upload }}</span>
                                          <p class="text-[10px] mt-1">{{ t().home.partner.form.maxFiles }}</p>
                                      </div>
                                  </div>
                              </div>

                              <div class="space-y-1">
                                  <label for="partnerNotes" class="text-xs font-bold text-slate-500 uppercase">{{ t().home.partner.form.notes }}</label>
                                  <textarea id="partnerNotes" name="description" ngModel rows="3" [placeholder]="t().home.partner.form.notesPlaceholder" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"></textarea>
                              </div>

                              <button type="submit" [disabled]="partnerForm.invalid" class="w-full bg-amber-500 text-white font-bold py-4 rounded-lg hover:bg-amber-600 transition-colors text-sm tracking-wider uppercase shadow-lg mt-2 disabled:bg-slate-300 disabled:cursor-not-allowed">
                                 {{ t().home.partner.form.submit }}
                              </button>
                           </form>
                         }
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Campaigns (Bottom) -->
    <section class="bg-amber-500 py-12">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-900/10">
                <div class="p-4">
                    <span class="block text-4xl font-black text-slate-900 mb-1">%15</span>
                    <span class="text-sm font-bold uppercase tracking-wider text-slate-800 block">{{ t().home.campaigns.early }}</span>
                </div>
                <div class="p-4">
                    <span class="block text-4xl font-black text-slate-900 mb-1">7/24</span>
                    <span class="text-sm font-bold uppercase tracking-wider text-slate-800 block">{{ t().home.campaigns.roadside }}</span>
                </div>
                <div class="p-4">
                    <span class="block text-4xl font-black text-slate-900 mb-1">{{ t().home.campaigns.free }}</span>
                    <span class="text-sm font-bold uppercase tracking-wider text-slate-800 block">{{ t().home.campaigns.delivery }}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Tours Section (Moved Here) -->
    <section class="py-16 bg-white border-t border-slate-100">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
             <h2 class="text-3xl font-serif font-bold text-slate-900">{{ t().home.tours.title }}</h2>
             <p class="text-slate-500 mt-2">{{ t().home.tours.subtitle }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
             @for (tour of displayedTours(); track tour.id) {
                <div (click)="openTourModal(tour)" class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-100 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-2 relative">
                   <div class="h-64 overflow-hidden relative">
                      <img [src]="tour.image" [alt]="tour.title" loading="lazy" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div class="absolute bottom-4 left-4 text-white">
                         <h3 class="text-2xl font-serif font-bold">{{tour.title}}</h3>
                      </div>
                      <div class="absolute top-4 right-4 bg-amber-500 text-slate-900 font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                         {{tour.duration}}
                      </div>
                   </div>
                   
                   <div class="p-6 flex flex-col flex-grow">
                      <p class="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{{tour.description}}</p>
                      
                      <div class="space-y-2 mb-6">
                         @for (highlight of tour.highlights.slice(0, 2); track highlight) {
                            <div class="flex items-center text-xs font-bold text-slate-500">
                               <svg class="w-4 h-4 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                               {{highlight}}
                            </div>
                         }
                         @if (tour.highlights.length > 2) {
                            <div class="text-xs font-bold text-amber-600 mt-2">+ {{tour.highlights.length - 2}} özellik daha</div>
                         }
                      </div>

                      <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                          <span class="text-2xl font-bold text-slate-900">{{tour.price}} ₺</span>
                          <span class="text-amber-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                             İncele <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                          </span>
                       </div>
                   </div>
                </div>
             }
          </div>
          
          @if (tours().length > 3 && !showAllTours()) {
              <div class="text-center mt-12">
                  <button (click)="toggleTours()" class="bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-full font-bold transition-all uppercase tracking-widest text-sm">
                      {{ t().home.tours.viewAll }}
                  </button>
              </div>
          }
       </div>
    </section>

    <!-- Tour Modal Overlay -->
    @if (selectedTour()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" (click)="closeTourModal()"></div>
            
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col animate-slide-up">
                <!-- Header Image -->
                <div class="relative h-64 sm:h-80 flex-shrink-0">
                    <img [src]="selectedTour().image" [alt]="selectedTour().title" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    
                    <!-- Back/Close Button -->
                    <button (click)="closeTourModal()" class="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-full transition-colors flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        <span class="font-bold text-sm">Geri Dön</span>
                    </button>

                    <div class="absolute bottom-6 left-6 right-6">
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="bg-amber-500 text-slate-900 font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                                {{selectedTour().duration}}
                            </span>
                        </div>
                        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white">{{selectedTour().title}}</h2>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6 sm:p-8 flex-grow">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="md:col-span-2 space-y-6">
                            <div>
                                <h3 class="text-xl font-bold text-slate-900 mb-3">Tur Hakkında</h3>
                                <p class="text-slate-600 leading-relaxed text-base">{{selectedTour().description}}</p>
                            </div>
                            
                            <div>
                                <h3 class="text-xl font-bold text-slate-900 mb-3">Öne Çıkanlar</h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    @for (highlight of selectedTour().highlights; track highlight) {
                                        <div class="flex items-start">
                                            <svg class="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                            <span class="text-slate-700 font-medium">{{highlight}}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="md:col-span-1">
                            <div class="bg-slate-50 p-6 rounded-xl border border-slate-100 sticky top-6">
                                <div class="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Kişi Başı</div>
                                <div class="text-4xl font-bold text-slate-900 mb-6">{{selectedTour().price}} ₺</div>
                                
                                <button (click)="bookTour(selectedTour()); closeTourModal()" class="w-full bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-900 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/30 flex items-center justify-center">
                                    {{ t().home.tours.bookBtn }}
                                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    @if (isLightboxOpen()) {
        <app-lightbox 
            [items]="lightboxItems()" 
            [initialIndex]="lightboxIndex()" 
            (close)="closeLightbox()">
        </app-lightbox>
    }
  `
})
export class HomeComponent {
  carService = inject(CarService);
  uiService = inject(UiService);
  router = inject(Router);
  rentCarFormSent = signal(false);
  favorites = signal<number[]>([]);
  windowOrigin = window.location.origin;

  t = this.uiService.translations;

  // Lightbox Signals
  isLightboxOpen = signal(false);
  lightboxItems = signal<any[]>([]);
  lightboxIndex = signal(0);

  // Tour Modal Signal
  selectedTour = signal<any | null>(null);

  openTourModal(tour: any) {
      this.selectedTour.set(tour);
      document.body.style.overflow = 'hidden';
  }

  closeTourModal() {
      this.selectedTour.set(null);
      document.body.style.overflow = '';
  }

  // Signals
  tours = this.carService.getTours();
  showAllTours = signal(false);
  displayedTours = computed(() => {
      return this.showAllTours() ? this.tours() : this.tours().slice(0, 3);
  });
  featuredCars = computed(() => {
    const cars = this.carService.getCars()().filter(c => c.isAvailable !== false);
    return cars.sort((a, b) => {
      // Prioritize FIRSAT badge
      if (a.badge === 'FIRSAT' && b.badge !== 'FIRSAT') return -1;
      if (b.badge === 'FIRSAT' && a.badge !== 'FIRSAT') return 1;
      // Then prioritize discount rate
      const aDiscount = a.discountRate || 0;
      const bDiscount = b.discountRate || 0;
      if (aDiscount !== bDiscount) return bDiscount - aDiscount;
      // Then price ascending
      return a.price - b.price;
    }).slice(0, 3);
  });
  
  featuredSaleCars = computed(() => {
    const cars = this.carService.getSaleCars()().filter(c => c.availability !== 'Satıldı');
    return cars.sort((a, b) => {
      // Prioritize FIRSAT badge
      if (a.badge === 'FIRSAT' && b.badge !== 'FIRSAT') return -1;
      if (b.badge === 'FIRSAT' && a.badge !== 'FIRSAT') return 1;
      // Then prioritize price drops
      if (a.isPriceDropped && !b.isPriceDropped) return -1;
      if (b.isPriceDropped && !a.isPriceDropped) return 1;
      // Then price ascending
      return a.price - b.price;
    }).slice(0, 3);
  });

  shareCar(car: any, event: Event, type: 'rental' | 'sale') {
    event.stopPropagation();
    const path = type === 'rental' ? '/fleet/' : '/sales/';
    const url = `${this.windowOrigin}${path}${car.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${car.brand} ${car.model} - Alperler Rent A Car`,
        text: `${car.brand} ${car.model} aracını inceleyin!`,
        url: url
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Bağlantı kopyalandı!');
      });
    }
  }

  toggleTours() {
      this.showAllTours.update(v => !v);
  }

  // Booking Engine Signals
  pickupLocation = 'merkez';
  pickupDate = '';
  returnDate = '';
  serviceType = 'individual'; // Dropdown value
  rentalDuration = 'daily';

  searchCars(event: Event) {
    event.preventDefault();
    this.router.navigate(['/fleet'], {
      queryParams: {
        location: this.pickupLocation,
        start: this.pickupDate,
        end: this.returnDate,
        driver: this.serviceType === 'driver' ? 'true' : 'false',
        duration: this.rentalDuration
      }
    });
  }

  goToFleet(type: string) {
    this.router.navigate(['/fleet'], { queryParams: { filter: type } }); 
  }

  goToDetail(id: number, type: 'fleet' | 'sales', event: Event) {
    event.stopPropagation();
    this.router.navigate([`/${type}`, id]);
  }

  rentCar(car: Car, event: Event) {
    event.stopPropagation();
    const request = {
      type: 'RENTAL' as const,
      item: car,
      itemName: `${car.brand} ${car.model}`,
      image: car.image,
      basePrice: car.price,
      startDate: '',
      endDate: '',
      withDriver: false
    };
    this.carService.setBookingRequest(request);
    this.uiService.toggleContact(true);
  }

  buyCar(car: Car, event: Event) {
    event.stopPropagation();
    const request = {
      type: 'SALE_INQUIRY' as const,
      item: car,
      itemName: `${car.brand} ${car.model}`,
      image: car.image,
      basePrice: car.price
    };
    this.carService.setBookingRequest(request);
    this.uiService.toggleContact(true);
  }

  bookTour(tour: any) {
    this.carService.setBookingRequest({
      type: 'TOUR',
      itemName: tour.title,
      item: tour,
      image: tour.image,
      basePrice: tour.price
    });
    this.uiService.toggleContact(true);
  }

  submitRentCarForm(form: any) {
    if (form.valid) {
        const { name, phone, email, carBrand, modelYear, km, description } = form.value;
        this.carService.addPartnerRequest({
            name,
            phone,
            email,
            carBrand,
            modelYear: parseInt(modelYear),
            km: parseInt(km),
            description
        });
        this.rentCarFormSent.set(true);
        form.resetForm();
    }
  }

  scrollToBooking() {
    document.getElementById('bookingArea')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleFavorite(carId: number, event: Event) {
    event.stopPropagation();
    this.carService.toggleFavorite(carId);
  }

  isFavorite(carId: number): boolean {
    return this.carService.isFavorite(carId);
  }

  openLightbox(images: string[], index: number) {
    this.lightboxItems.set(images.map(url => ({ type: 'image', url })));
    this.lightboxIndex.set(index);
    this.isLightboxOpen.set(true);
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
  }
}
