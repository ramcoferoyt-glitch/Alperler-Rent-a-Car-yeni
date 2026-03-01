
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Blog Yönetimi</h1>
        <button (click)="toggleForm()" class="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-amber-600 transition-colors">+ Yeni Yazı Ekle</button>
    </div>

    @if (showForm()) {
        <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8 animate-fade-in">
             <h3 class="font-bold text-xl mb-4">Yeni Blog Yazısı</h3>
             <div class="space-y-4">
                 <input [(ngModel)]="newPost.title" placeholder="Başlık" class="w-full p-3 border rounded bg-slate-50 font-bold">
                 <input [(ngModel)]="newPost.summary" placeholder="Kısa Özet" class="w-full p-3 border rounded bg-slate-50">
                 <textarea [(ngModel)]="newPost.content" rows="5" placeholder="İçerik (HTML destekler)" class="w-full p-3 border rounded bg-slate-50"></textarea>
                 <div class="flex gap-4">
                    <input [(ngModel)]="newPost.image" placeholder="Resim URL" class="flex-1 p-3 border rounded bg-slate-50">
                    <input [(ngModel)]="newPost.readTime" placeholder="Okuma Süresi (Örn: 5 dk)" class="flex-1 p-3 border rounded bg-slate-50">
                 </div>
                 <div class="flex justify-end space-x-4">
                     <button (click)="toggleForm()" class="text-slate-500 font-bold">İptal</button>
                     <button (click)="addPost()" class="bg-slate-900 text-white px-6 py-2 rounded font-bold">Yayınla</button>
                 </div>
             </div>
        </div>
    }

    <div class="grid grid-cols-1 gap-6">
        @for (post of posts(); track post.id) {
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center group hover:border-amber-500 transition-all">
                <div class="flex items-center">
                    <img [src]="post.image" class="w-20 h-20 object-cover rounded-lg mr-6 shadow-sm">
                    <div>
                        <h3 class="font-bold text-lg text-slate-900">{{ post.title }}</h3>
                        <p class="text-slate-500 text-sm line-clamp-1">{{ post.summary }}</p>
                        <span class="text-xs text-slate-400 mt-1 block">{{ post.date }}</span>
                    </div>
                </div>
                <button (click)="deletePost(post.id)" class="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        }
    </div>
  `
})
export class AdminBlogComponent {
  carService = inject(CarService);
  posts = this.carService.getBlogPosts();
  showForm = signal(false);

  newPost: any = {
      title: '', summary: '', content: '', image: 'https://picsum.photos/800/600', readTime: '', date: new Date().toLocaleDateString('tr-TR')
  };

  toggleForm() { this.showForm.update(v => !v); }

  addPost() {
      this.carService.addBlogPost(this.newPost);
      this.toggleForm();
      // Reset
      this.newPost = { title: '', summary: '', content: '', image: 'https://picsum.photos/800/600', readTime: '', date: new Date().toLocaleDateString('tr-TR') };
  }

  deletePost(id: number) {
      if(confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
          this.carService.deleteBlogPost(id);
      }
  }
}
