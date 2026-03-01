
import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UiService } from '../services/ui.service';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-legal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen pt-28 pb-20 font-sans">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
            {{ title() }}
        </h1>
        <div class="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line" [innerHTML]="content()">
        </div>
        
        <div class="mt-8 text-center">
            <button (click)="close()" class="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors">Kapat</button>
        </div>
      </div>
    </div>
  `
})
export class LegalComponent implements OnInit {
  route = inject(ActivatedRoute);
  uiService = inject(UiService);
  carService = inject(CarService);
  config = this.carService.getConfig();
  
  title = signal('');
  content = signal('');

  constructor() {
      effect(() => {
          const type = this.uiService.legalType();
          if (type) {
              this.setContent(type);
          }
      });
  }

  ngOnInit() {
      this.route.data.subscribe(data => {
          if (data['type']) {
             this.setContent(data['type']);
             window.scrollTo(0,0);
          }
      });
  }

  close() {
      this.uiService.openLegal(null as any); // Close overlay
  }

  setContent(type: string) {
      const cfg = this.config();
      if (type === 'kvkk') {
          this.title.set('KVKK Aydınlatma Metni');
          this.content.set(cfg.kvkkText);
      } else if (type === 'privacy') {
          this.title.set('Gizlilik Politikası');
          this.content.set(cfg.privacyText);
      } else if (type === 'cookies') {
          this.title.set('Çerez Politikası');
          this.content.set(cfg.cookiesText);
      } else if (type === 'terms') {
          this.title.set('Kiralama Koşulları');
          this.content.set(cfg.termsText);
      }
  }
}
