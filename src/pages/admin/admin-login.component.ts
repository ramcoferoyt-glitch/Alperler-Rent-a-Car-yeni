
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex font-sans bg-slate-100">
      
      <!-- Left Side: Branding (Hidden on mobile) -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
         <div class="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1920&auto=format&fit=crop" alt="Admin Background" class="object-cover w-full h-full opacity-20">
         </div>
         <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-900/20"></div>
         
         <div class="relative z-10 text-center p-12 animate-fade-in">
             <div class="w-24 h-24 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center text-5xl font-serif font-bold mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.4)]">A</div>
             <h1 class="text-6xl font-serif font-bold text-white mb-4 tracking-tight">YÖNETİM</h1>
             <p class="text-slate-400 text-xl tracking-[0.3em] uppercase font-light border-t border-white/10 pt-6 mt-6 inline-block">Alperler Rent A Car</p>
         </div>
      </div>

      <!-- Right Side: Login Card -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-8 relative">
          
          <!-- Back to Site -->
          <a href="/" class="absolute top-8 right-8 text-sm font-bold text-slate-400 hover:text-slate-900 flex items-center transition-colors">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
             Siteye Dön
          </a>

          <div class="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100 animate-fade-in-up">
              <div class="text-center mb-10">
                  <span class="bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">Yönetici Paneli</span>
                  <h2 class="text-3xl font-bold text-slate-900">Giriş Yapın 👋</h2>
                  <p class="text-slate-500 mt-2 text-sm">Devam etmek için yetkili hesap bilgilerinizle oturum açın.</p>
              </div>

              @if (!showForgotPass) {
                  <form (submit)="onLogin($event)" class="space-y-5">
                      
                      <div class="space-y-4">
                          <div class="relative group">
                              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <svg class="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                              </div>
                              <input type="email" [(ngModel)]="username" name="username" class="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-xl outline-none font-bold text-slate-900 transition-all placeholder-slate-400" placeholder="Kullanıcı Adı / E-Posta">
                          </div>

                          <div class="relative group">
                              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <svg class="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                              </div>
                              <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" class="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-xl outline-none font-bold text-slate-900 transition-all placeholder-slate-400" placeholder="Şifre">
                              
                              <button type="button" (click)="togglePasswordVisibility()" class="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                                  @if(showPassword()) {
                                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                  } @else {
                                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                  }
                              </button>
                          </div>
                      </div>

                      @if (errorMsg()) {
                          <div class="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 animate-pulse">
                              <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              <span class="text-sm font-bold">{{ errorMsg() }}</span>
                          </div>
                      }

                      <div class="flex justify-end">
                          <button type="button" (click)="toggleForgot()" class="text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">Şifrenizi mi unuttunuz?</button>
                      </div>

                      <button type="submit" [disabled]="isLoading()" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:bg-amber-500 hover:text-slate-900 hover:shadow-amber-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95">
                          @if(isLoading()) {
                              <span class="flex items-center justify-center">
                                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                  Kontrol Ediliyor...
                              </span>
                          } @else {
                              Giriş Yap
                          }
                      </button>
                  </form>
              } @else {
                  <!-- Forgot Password View -->
                  <div class="space-y-6 animate-fade-in">
                      <div class="text-center">
                          <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          </div>
                          <h3 class="font-bold text-slate-900 text-lg">Şifre Sıfırlama</h3>
                          <p class="text-slate-500 text-sm mt-1">E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.</p>
                      </div>

                      @if(!resetSuccess()) {
                          <div class="space-y-4">
                              <input type="email" [(ngModel)]="resetEmail" class="w-full p-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-xl outline-none font-bold" placeholder="E-Posta Adresiniz">
                              <button (click)="doReset()" [disabled]="isLoading()" class="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg">
                                  @if(isLoading()) { Bekleyiniz... } @else { Link Gönder }
                              </button>
                          </div>
                      } @else {
                          <div class="bg-green-50 p-6 rounded-xl border border-green-100 text-center animate-fade-in">
                              <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              <p class="text-green-800 font-bold text-lg">Başarılı!</p>
                              <p class="text-slate-600 text-sm mt-1">Lütfen e-posta kutunuzu kontrol edin.</p>
                          </div>
                      }

                      <button (click)="toggleForgot()" class="w-full py-2 text-slate-400 font-bold hover:text-slate-900 transition-colors text-sm">
                          &larr; Giriş Ekranına Dön
                      </button>
                  </div>
              }
          </div>

          <div class="mt-8 text-center text-xs text-slate-400 font-medium">
              &copy; 2024 Alperler Rent A Car Yönetim Paneli v3.1
          </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  username = '';
  password = '';
  errorMsg = signal('');
  showPassword = signal(false);
  isLoading = signal(false);
  
  showForgotPass = false;
  resetEmail = '';
  resetSuccess = signal(false);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  clearError() {
    this.errorMsg.set('');
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  async onLogin(e: Event) {
    e.preventDefault();
    this.clearError();
    this.isLoading.set(true);
    
    const success = await this.authService.login(this.username, this.password);
    
    this.isLoading.set(false);

    if (success) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.errorMsg.set('Kullanıcı adı veya şifre hatalı.');
    }
  }

  toggleForgot() {
      this.showForgotPass = !this.showForgotPass;
      this.resetSuccess.set(false);
      this.resetEmail = '';
      this.errorMsg.set('');
  }

  async doReset() {
      if (!this.resetEmail || !this.resetEmail.includes('@')) {
         this.errorMsg.set('Geçerli bir e-posta adresi giriniz.');
         return;
      }

      this.isLoading.set(true);
      const success = await this.authService.resetPassword(this.resetEmail);
      this.isLoading.set(false);
      
      if(success) {
          this.resetSuccess.set(true);
          this.errorMsg.set('');
      } else {
          this.errorMsg.set('İşlem başarısız oldu.');
      }
  }
}
