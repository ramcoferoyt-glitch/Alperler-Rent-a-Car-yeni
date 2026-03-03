
import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './pages/home.component';
import { FleetComponent } from './pages/fleet.component';
import { SalesComponent } from './pages/sales.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { BlogDetailComponent } from './pages/blog-detail.component';
import { BlogListComponent } from './pages/blog-list.component';
import { FaqComponent } from './pages/faq.component';
import { LegalComponent } from './pages/legal.component';
import { MainLayoutComponent } from './components/main-layout.component';
import { CarDetailComponent } from './pages/car-detail.component';

// Admin Pages
import { AdminLayoutComponent } from './pages/admin/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminCarsComponent } from './pages/admin/admin-cars.component';
import { AdminReservationsComponent } from './pages/admin/admin-reservations.component';
import { AdminBlogComponent } from './pages/admin/admin-blog.component';
import { AdminSettingsComponent } from './pages/admin/admin-settings.component';
import { AdminPartnerRequestsComponent } from './pages/admin/admin-partner-requests.component';
import { AdminToursComponent } from './pages/admin/admin-tours.component';
import { AdminFeedbackComponent } from './pages/admin/admin-feedback.component';

const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/admin/login');
};

export const routes: Routes = [
  // Standalone Admin Login (No Main Layout)
  { 
    path: 'admin/login', 
    loadComponent: () => import('./pages/admin/admin-login.component').then(m => m.AdminLoginComponent)
  },

  // Public Routes (Wrapped in MainLayout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'fleet', component: FleetComponent },
      { path: 'fleet/:id', component: CarDetailComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blog', component: BlogListComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'list-your-car', loadComponent: () => import('./pages/list-your-car.component').then(m => m.ListYourCarComponent) },
      { path: 'legal/kvkk', component: LegalComponent, data: { type: 'kvkk', title: 'KVKK Aydınlatma Metni' } },
      { path: 'legal/privacy', component: LegalComponent, data: { type: 'privacy', title: 'Gizlilik Politikası' } },
      { path: 'legal/cookies', component: LegalComponent, data: { type: 'cookies', title: 'Çerez Politikası' } },
      { path: 'legal/terms', component: LegalComponent, data: { type: 'terms', title: 'Kullanım Şartları' } },
      { path: 'legal/distance-selling', component: LegalComponent, data: { type: 'distance-selling', title: 'Mesafeli Satış Sözleşmesi' } },
      { path: 'legal/cancellation', component: LegalComponent, data: { type: 'cancellation', title: 'İade ve İptal Politikası' } },
      { path: 'legal/insurance', component: LegalComponent, data: { type: 'insurance', title: 'Araç Sigorta ve Sorumluluk Metinleri' } },
    ]
  },
  
  // Admin Routes (Separate Layout)
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'cars', component: AdminCarsComponent },
      { path: 'reservations', component: AdminReservationsComponent },
      { path: 'sales', component: AdminCarsComponent },
      { path: 'tours', component: AdminToursComponent },
      { path: 'blog', component: AdminBlogComponent },
      { path: 'requests', component: AdminPartnerRequestsComponent },
      { path: 'feedback', component: AdminFeedbackComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
