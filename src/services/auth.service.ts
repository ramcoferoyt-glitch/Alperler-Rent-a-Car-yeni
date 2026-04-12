
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);

  constructor(private router: Router) {
    // Check local storage for persistence across reloads
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      this._isLoggedIn.set(true);
    }
    
    // Initialize default credentials if not set
    const envUser = (typeof process !== 'undefined' && process.env && process.env['ADMIN_USER']) || '';
    const envPass = (typeof process !== 'undefined' && process.env && process.env['ADMIN_PASS']) || '';

    if (!localStorage.getItem('adminUser')) {
        localStorage.setItem('adminUser', envUser || 'ishak595@gmail.com');
    }
    if (!localStorage.getItem('adminPass')) {
        localStorage.setItem('adminPass', envPass || 'i4h4k5a2p7r7');
    }
  }

  get isLoggedIn() {
    return this._isLoggedIn.asReadonly();
  }

  async login(username: string, pass: string): Promise<boolean> {
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!username || !pass) return false;

    // Normalize inputs
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Get stored credentials
    const envUser = (typeof process !== 'undefined' && process.env && process.env['ADMIN_USER']) || '';
    const envPass = (typeof process !== 'undefined' && process.env && process.env['ADMIN_PASS']) || '';

    const validUser = localStorage.getItem('adminUser') || envUser || 'ishak595@gmail.com';
    const validPass = localStorage.getItem('adminPass') || envPass || 'i4h4k5a2p7r7';

    if (cleanUser === validUser && cleanPass === validPass) {
      this._isLoggedIn.set(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    
    return false;
  }

  verifyCredentials(pass: string): boolean {
      const cleanPass = pass.trim();
      const validPass = localStorage.getItem('adminPass') || ((typeof process !== 'undefined' && process.env && process.env['ADMIN_PASS']) || 'i4h4k5a2p7r7');
      return cleanPass === validPass;
  }

  getCurrentEmail(): string {
      return localStorage.getItem('adminUser') || ((typeof process !== 'undefined' && process.env && process.env['ADMIN_USER']) || 'ishak595@gmail.com');
  }

  updateCredentials(newUser: string, newPass: string) {
      localStorage.setItem('adminUser', newUser.trim().toLowerCase());
      localStorage.setItem('adminPass', newPass.trim());
      return true;
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('adminAuth');
    this.router.navigate(['/admin/login']);
  }
  
  async resetPassword(email: string): Promise<boolean> {
     await new Promise(resolve => setTimeout(resolve, 1500));
     // Simulate success for any valid looking email
     if(email && email.includes('@')) {
        return true;
     }
     return false;
  }
}
