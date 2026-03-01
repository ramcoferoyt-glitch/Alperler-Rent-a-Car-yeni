
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService, FaqItem } from '../../services/car.service';
import { SiteConfig, TeamMember } from '../../models/site-config.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1 class="text-3xl font-bold text-slate-900 mb-8">Genel Site Ayarları</h1>
    
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl">
        
        @if(saveSuccess()) {
           <div class="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center font-bold animate-fade-in">
               Ayarlar başarıyla kaydedildi ve web sitesinde güncellendi!
           </div>
        }

        <div class="flex space-x-4 border-b border-slate-200 mb-6 overflow-x-auto">
            <button (click)="activeTab.set('general')" [class.border-amber-500]="activeTab() === 'general'" [class.text-amber-600]="activeTab() === 'general'" class="pb-2 px-4 font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors whitespace-nowrap">Genel</button>
            <button (click)="activeTab.set('content')" [class.border-amber-500]="activeTab() === 'content'" [class.text-amber-600]="activeTab() === 'content'" class="pb-2 px-4 font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors whitespace-nowrap">İçerik Yönetimi</button>
            <button (click)="activeTab.set('team')" [class.border-amber-500]="activeTab() === 'team'" [class.text-amber-600]="activeTab() === 'team'" class="pb-2 px-4 font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors whitespace-nowrap">Ekip & Hakkımızda</button>
            <button (click)="activeTab.set('legal')" [class.border-amber-500]="activeTab() === 'legal'" [class.text-amber-600]="activeTab() === 'legal'" class="pb-2 px-4 font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors whitespace-nowrap">Yasal Metinler</button>
            <button (click)="activeTab.set('faq')" [class.border-amber-500]="activeTab() === 'faq'" [class.text-amber-600]="activeTab() === 'faq'" class="pb-2 px-4 font-bold text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-colors whitespace-nowrap">SSS</button>
        </div>

        <form (submit)="saveConfig($event)" class="space-y-8">
           
           <!-- GENERAL TAB -->
           @if(activeTab() === 'general') {
               <!-- Contact Info -->
               <div class="space-y-4">
                  <h3 class="font-bold text-lg border-b pb-2 text-slate-700">İletişim Bilgileri</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Şirket Adı</label>
                         <input [(ngModel)]="formConfig.companyName" name="companyName" class="w-full p-3 bg-slate-50 border rounded font-bold">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Telefon</label>
                         <input [(ngModel)]="formConfig.phone" name="phone" class="w-full p-3 bg-slate-50 border rounded font-bold">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">E-Posta</label>
                         <input [(ngModel)]="formConfig.email" name="email" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp (Sadece Numara)</label>
                         <input [(ngModel)]="formConfig.whatsapp" name="whatsapp" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                      <div class="md:col-span-2">
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Adres</label>
                         <input [(ngModel)]="formConfig.address" name="address" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                  </div>
               </div>

               <!-- Social Media -->
               <div class="space-y-4">
                  <h3 class="font-bold text-lg border-b pb-2 text-slate-700">Sosyal Medya Linkleri</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Instagram URL</label>
                         <input [(ngModel)]="formConfig.instagramUrl" name="instagram" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Twitter (X) URL</label>
                         <input [(ngModel)]="formConfig.twitterUrl" name="twitter" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">YouTube URL</label>
                         <input [(ngModel)]="formConfig.youtubeUrl" name="youtube" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                      <div>
                         <label class="block text-xs font-bold text-slate-500 uppercase mb-1">TikTok URL</label>
                         <input [(ngModel)]="formConfig.tiktokUrl" name="tiktok" class="w-full p-3 bg-slate-50 border rounded">
                      </div>
                  </div>
               </div>

               <!-- Hero & Footer -->
               <div class="space-y-4">
                  <h3 class="font-bold text-lg border-b pb-2 text-slate-700">Ana Sayfa & Footer</h3>
                  <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Başlık</label>
                     <input [(ngModel)]="formConfig.heroTitle" name="heroTitle" class="w-full p-3 bg-slate-50 border rounded font-bold">
                  </div>
                  <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hero Alt Başlık</label>
                     <input [(ngModel)]="formConfig.heroSubtitle" name="heroSubtitle" class="w-full p-3 bg-slate-50 border rounded">
                  </div>
                  <div>
                     <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Alt Bilgi (Footer) Yazısı</label>
                     <input [(ngModel)]="formConfig.footerText" name="footerText" class="w-full p-3 bg-slate-50 border rounded">
                  </div>
                  
                  <div class="pt-4 border-t border-slate-200">
                      <h4 class="font-bold text-sm text-slate-700 mb-2">İstatistikler</h4>
                      <button type="button" (click)="resetStats()" class="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded font-bold text-sm transition-colors">
                          Ziyaretçi Sayacını Sıfırla
                      </button>
                  </div>
               </div>

               <!-- Theme Selection -->
               <div class="space-y-4">
                   <h3 class="font-bold text-lg border-b pb-2 text-slate-700">Tema Seçimi</h3>
                   <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <button type="button" (click)="setTheme('light')" [class.ring-2]="formConfig.theme === 'light'" class="p-4 border rounded bg-white hover:bg-slate-50 text-slate-900 font-bold ring-amber-500 transition-all">
                           Açık Tema
                       </button>
                       <button type="button" (click)="setTheme('dark')" [class.ring-2]="formConfig.theme === 'dark'" class="p-4 border rounded bg-slate-900 hover:bg-slate-800 text-white font-bold ring-amber-500 transition-all">
                           Koyu Tema
                       </button>
                       <button type="button" (click)="setTheme('luxury')" [class.ring-2]="formConfig.theme === 'luxury'" class="p-4 border rounded bg-stone-900 hover:bg-stone-800 text-amber-500 font-bold ring-amber-500 transition-all">
                           Luxury
                       </button>
                       <button type="button" (click)="setTheme('corporate')" [class.ring-2]="formConfig.theme === 'corporate'" class="p-4 border rounded bg-blue-900 hover:bg-blue-800 text-white font-bold ring-amber-500 transition-all">
                           Kurumsal
                       </button>
                   </div>
               </div>
           }

           <!-- CONTENT MANAGEMENT TAB -->
           @if(activeTab() === 'content') {
               <div class="space-y-8">
                   
                   <!-- Hero Section -->
                   <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mb-4">Ana Sayfa Üst Bölüm (Hero)</h3>
                       <div class="space-y-4">
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ana Başlık</label>
                               <textarea [(ngModel)]="formConfig.heroTitle" name="heroTitle" rows="2" class="w-full p-3 bg-white border rounded font-bold text-lg"></textarea>
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Alt Başlık (Açıklama)</label>
                               <textarea [(ngModel)]="formConfig.heroSubtitle" name="heroSubtitle" rows="3" class="w-full p-3 bg-white border rounded"></textarea>
                           </div>
                       </div>
                   </div>

                   <!-- Campaigns -->
                   <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mb-4">Kampanyalar (Alt Bant)</h3>
                       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Erken Rezervasyon</label>
                               <input [(ngModel)]="formConfig.campaignEarlyBooking" name="campaignEarlyBooking" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Yol Yardım</label>
                               <input [(ngModel)]="formConfig.campaignRoadside" name="campaignRoadside" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Teslimat</label>
                               <input [(ngModel)]="formConfig.campaignFreeDelivery" name="campaignFreeDelivery" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                       </div>
                   </div>

                   <!-- Why Us -->
                   <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mb-4">Neden Biz? Bölümü</h3>
                       <div class="space-y-4">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                   <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Ana Başlık</label>
                                   <input [(ngModel)]="formConfig.whyUsTitle" name="whyUsTitle" class="w-full p-3 bg-white border rounded font-bold">
                               </div>
                               <div>
                                   <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Alt Başlık (Açıklama)</label>
                                   <textarea [(ngModel)]="formConfig.whyUsSubtitle" name="whyUsSubtitle" rows="2" class="w-full p-3 bg-white border rounded"></textarea>
                               </div>
                           </div>
                           
                           <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                               <!-- Trust -->
                               <div class="space-y-2">
                                   <label class="block text-xs font-bold text-amber-600 uppercase">Güven Özelliği</label>
                                   <input [(ngModel)]="formConfig.whyUsTrustTitle" name="whyUsTrustTitle" class="w-full p-2 bg-white border rounded font-bold text-sm" placeholder="Başlık">
                                   <textarea [(ngModel)]="formConfig.whyUsTrustDesc" name="whyUsTrustDesc" rows="3" class="w-full p-2 bg-white border rounded text-xs" placeholder="Açıklama"></textarea>
                               </div>
                               <!-- Support -->
                               <div class="space-y-2">
                                   <label class="block text-xs font-bold text-amber-600 uppercase">Destek Özelliği</label>
                                   <input [(ngModel)]="formConfig.whyUsSupportTitle" name="whyUsSupportTitle" class="w-full p-2 bg-white border rounded font-bold text-sm" placeholder="Başlık">
                                   <textarea [(ngModel)]="formConfig.whyUsSupportDesc" name="whyUsSupportDesc" rows="3" class="w-full p-2 bg-white border rounded text-xs" placeholder="Açıklama"></textarea>
                               </div>
                               <!-- Comfort -->
                               <div class="space-y-2">
                                   <label class="block text-xs font-bold text-amber-600 uppercase">Konfor Özelliği</label>
                                   <input [(ngModel)]="formConfig.whyUsComfortTitle" name="whyUsComfortTitle" class="w-full p-2 bg-white border rounded font-bold text-sm" placeholder="Başlık">
                                   <textarea [(ngModel)]="formConfig.whyUsComfortDesc" name="whyUsComfortDesc" rows="3" class="w-full p-2 bg-white border rounded text-xs" placeholder="Açıklama"></textarea>
                               </div>
                           </div>
                       </div>
                   </div>

                   <!-- Sales Section -->
                   <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mb-4">Satış Bölümü</h3>
                       <div class="space-y-4">
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Başlık</label>
                                <input [(ngModel)]="formConfig.salesTitle" name="salesTitle" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Açıklama</label>
                               <textarea [(ngModel)]="formConfig.salesDesc" name="salesDesc" rows="3" class="w-full p-3 bg-white border rounded"></textarea>
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Buton Metni</label>
                               <input [(ngModel)]="formConfig.salesCta" name="salesCta" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                       </div>
                   </div>

                   <!-- Partner Section -->
                   <div class="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mb-4">Partner (Araç Kiralama) Bölümü</h3>
                       <div class="space-y-4">
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Başlık</label>
                               <input [(ngModel)]="formConfig.partnerTitle" name="partnerTitle" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Alt Başlık</label>
                               <textarea [(ngModel)]="formConfig.partnerSubtitle" name="partnerSubtitle" rows="2" class="w-full p-3 bg-white border rounded"></textarea>
                           </div>
                           <div>
                               <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Model Yılı Şartı Metni</label>
                               <input [(ngModel)]="formConfig.partnerRequirementYear" name="partnerRequirementYear" class="w-full p-3 bg-white border rounded font-bold">
                           </div>
                       </div>
                   </div>

               </div>
           }

           <!-- TEAM & ABOUT TAB -->
           @if(activeTab() === 'team') {
               <div class="space-y-6">
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hakkımızda Başlığı</label>
                       <input [(ngModel)]="formConfig.aboutTitle" name="aboutTitle" class="w-full p-3 bg-slate-50 border rounded font-bold">
                   </div>
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Hakkımızda Metni</label>
                       <textarea [(ngModel)]="formConfig.aboutText" name="aboutText" rows="8" class="w-full p-3 bg-slate-50 border rounded"></textarea>
                   </div>

                   <h3 class="font-bold text-lg border-b pb-2 text-slate-700 mt-8">Ekip Yönetimi</h3>
                   
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       @for(member of formConfig.team; track member.id; let i = $index) {
                           <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                               <button type="button" (click)="removeTeamMember(i)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                     <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                               </button>
                               
                               <div class="flex items-center gap-4 mb-4">
                                   <img [src]="member.image" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm">
                                   <div class="flex-1">
                                       <input [(ngModel)]="member.name" [name]="'name-' + i" class="w-full font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none mb-1" placeholder="İsim Soyisim">
                                       <input [(ngModel)]="member.role" [name]="'role-' + i" class="w-full text-sm text-amber-600 font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none" placeholder="Ünvan">
                                   </div>
                               </div>
                               
                               <textarea [(ngModel)]="member.description" [name]="'desc-' + i" rows="2" class="w-full text-sm text-slate-600 bg-white p-2 rounded border border-slate-200 focus:border-amber-500 focus:outline-none" placeholder="Kısa açıklama..."></textarea>
                               
                               <div class="mt-2">
                                   <label class="text-xs font-bold text-slate-400 uppercase block mb-1">Fotoğraf</label>
                                   <div class="flex items-center gap-2">
                                       <input type="file" (change)="onFileSelected($event, member)" accept="image/*" class="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100">
                                   </div>
                                   <input [(ngModel)]="member.image" [name]="'img-' + i" class="w-full text-xs p-1 bg-white border rounded text-slate-500 mt-1" placeholder="veya URL girin">
                               </div>
                           </div>
                       }
                       
                       <!-- Add New Member Card -->
                       <button type="button" (click)="addTeamMember()" class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 transition-all min-h-[200px]">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 mb-2">
                             <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                           </svg>
                           <span class="font-bold">Yeni Ekip Üyesi Ekle</span>
                       </button>
                   </div>
               </div>
           }

           <!-- LEGAL TEXTS TAB -->
           @if(activeTab() === 'legal') {
               <div class="space-y-6">
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">KVKK Metni</label>
                       <textarea [(ngModel)]="formConfig.kvkkText" name="kvkkText" rows="10" class="w-full p-3 bg-slate-50 border rounded font-mono text-sm"></textarea>
                   </div>
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Gizlilik Politikası</label>
                       <textarea [(ngModel)]="formConfig.privacyText" name="privacyText" rows="10" class="w-full p-3 bg-slate-50 border rounded font-mono text-sm"></textarea>
                   </div>
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Çerez Politikası</label>
                       <textarea [(ngModel)]="formConfig.cookiesText" name="cookiesText" rows="10" class="w-full p-3 bg-slate-50 border rounded font-mono text-sm"></textarea>
                   </div>
                   <div>
                       <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Kiralama Sözleşmesi & Şartlar</label>
                       <textarea [(ngModel)]="formConfig.termsText" name="termsText" rows="10" class="w-full p-3 bg-slate-50 border rounded font-mono text-sm"></textarea>
                   </div>
               </div>
           }

           <!-- FAQ TAB -->
           @if(activeTab() === 'faq') {
               <div class="space-y-4">
                  <h3 class="font-bold text-lg border-b pb-2 text-slate-700">Sıkça Sorulan Sorular (SSS)</h3>
                  
                  <div class="space-y-4">
                      @for (faq of faqs(); track faq.id) {
                          <div class="bg-slate-50 p-4 rounded border border-slate-200">
                              <input [(ngModel)]="faq.question" [ngModelOptions]="{standalone: true}" (change)="updateFaq(faq)" class="w-full font-bold bg-transparent border-b border-slate-300 mb-2 focus:outline-none focus:border-amber-500" placeholder="Soru">
                              <textarea [(ngModel)]="faq.answer" [ngModelOptions]="{standalone: true}" (change)="updateFaq(faq)" rows="2" class="w-full bg-transparent text-sm text-slate-600 focus:outline-none" placeholder="Cevap"></textarea>
                              <div class="text-right mt-2">
                                  <button type="button" (click)="deleteFaq(faq.id)" class="text-red-500 text-xs font-bold hover:underline">Sil</button>
                              </div>
                          </div>
                      }
                  </div>

                  <div class="bg-slate-50 p-4 rounded border border-slate-200 border-dashed">
                      <h4 class="font-bold text-sm text-slate-900 mb-2">Yeni Soru Ekle</h4>
                      <input [(ngModel)]="newFaq.question" name="newQuestion" class="w-full p-2 bg-white border rounded mb-2 text-sm" placeholder="Soru">
                      <textarea [(ngModel)]="newFaq.answer" name="newAnswer" rows="2" class="w-full p-2 bg-white border rounded mb-2 text-sm" placeholder="Cevap"></textarea>
                      <button type="button" (click)="addFaq()" class="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold hover:bg-amber-500 hover:text-slate-900 transition-colors">Ekle</button>
                  </div>
               </div>
           }

           <div class="sticky bottom-4 bg-white/80 backdrop-blur p-4 border-t border-slate-200 shadow-lg rounded-xl mt-8 z-10">
               <button type="submit" class="w-full py-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-white font-bold rounded-lg uppercase tracking-widest transition-colors shadow-lg text-sm">
                   Tüm Ayarları Kaydet ve Yayınla
               </button>
           </div>

        </form>
    </div>
  `
})
export class AdminSettingsComponent {
  carService = inject(CarService);
  currentConfig = this.carService.getConfig();
  faqs = this.carService.getFaqs();
  
  formConfig: SiteConfig = { ...this.currentConfig() };
  saveSuccess = signal(false);
  activeTab = signal<'general' | 'content' | 'team' | 'legal' | 'faq'>('general');
  
  newFaq: Partial<FaqItem> = {};

  constructor() {
    effect(() => {
      // Sync form when signal changes from outside (initial load)
      this.formConfig = { ...this.currentConfig() };
      
      // Ensure team array exists
      if (!this.formConfig.team) {
          this.formConfig.team = [];
      }
    });
  }

  onFileSelected(event: any, member: TeamMember) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        member.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveConfig(event: Event) {
      event.preventDefault();
      this.carService.updateConfig(this.formConfig);
      this.saveSuccess.set(true);
      setTimeout(() => this.saveSuccess.set(false), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTheme(theme: 'light' | 'dark' | 'luxury' | 'corporate') {
      this.formConfig.theme = theme;
  }

  addTeamMember() {
      const newMember: TeamMember = {
          id: Date.now(),
          name: '',
          role: '',
          description: '',
          image: 'https://picsum.photos/200/200'
      };
      this.formConfig.team = [...this.formConfig.team, newMember];
  }

  removeTeamMember(index: number) {
      if(confirm('Bu ekip üyesini silmek istediğinize emin misiniz?')) {
          const newTeam = [...this.formConfig.team];
          newTeam.splice(index, 1);
          this.formConfig.team = newTeam;
      }
  }

  resetStats() {
      if(confirm('Ziyaretçi sayacını sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
          this.carService.resetStats();
          alert('İstatistikler sıfırlandı.');
      }
  }

  addFaq() {
      if(this.newFaq.question && this.newFaq.answer) {
          this.carService.addFaq(this.newFaq as FaqItem);
          this.newFaq = {};
      }
  }

  deleteFaq(id: number) {
      if(confirm('Silmek istediğinize emin misiniz?')) {
          this.carService.deleteFaq(id);
      }
  }

  updateFaq(faq: FaqItem) {
      this.carService.addFaq(faq);
  }
}
