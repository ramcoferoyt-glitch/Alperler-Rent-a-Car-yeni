
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-slate-50 min-h-screen pt-28 pb-20 font-sans">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h1 class="font-serif text-4xl font-bold text-slate-900 mb-4">Alperler Keşif Rehberi</h1>
            <p class="text-slate-500 max-w-2xl mx-auto">Yüksekova'nın doğası, tarihi ve araç kiralama dünyasına dair her şey.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
             @for (post of blogPosts(); track post.id) {
               <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-slate-100">
                  <div class="h-56 overflow-hidden relative">
                     <img [src]="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                     <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase rounded-sm shadow-sm">
                        {{post.readTime}}
                     </div>
                  </div>
                  <div class="p-6 flex flex-col flex-grow">
                     <div class="text-xs text-slate-400 mb-2">{{post.date}}</div>
                     <h3 class="font-bold text-xl text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">{{post.title}}</h3>
                     <p class="text-slate-500 text-sm mb-4 line-clamp-3">{{post.summary}}</p>
                     <div class="mt-auto pt-4 border-t border-slate-100">
                        <a [routerLink]="['/blog', post.id]" class="inline-flex items-center text-amber-600 font-bold uppercase text-xs tracking-widest hover:text-slate-900 transition-colors">
                           Devamını Oku
                           <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </a>
                     </div>
                  </div>
               </div>
             }
          </div>
       </div>
    </div>
  `
})
export class BlogListComponent {
  carService = inject(CarService);
  blogPosts = this.carService.getBlogPosts();
}
