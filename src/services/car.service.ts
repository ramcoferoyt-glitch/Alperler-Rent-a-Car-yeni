
import { Injectable, signal, computed, effect } from '@angular/core';
import { Car } from '../models/car.model';
import { SiteConfig, TeamMember } from '../models/site-config.model';
import { GoogleGenAI } from "@google/genai";

export interface SaleCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  expertReport?: string;
  transmission: 'Otomatik' | 'Manuel';
  fuel: 'Benzin' | 'Dizel' | 'Hibrit';
}

export interface Tour {
  id: number;
  title: string;
  duration: string;
  price: number;
  description: string;
  highlights: string[];
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  readTime: string;
  date: string;
}

export interface BookingRequest {
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  dateCreated?: Date;
  customerName?: string;
  customerEmail?: string; 
  customerPhone?: string;
  
  type: 'RENTAL' | 'TOUR' | 'SALE_INQUIRY';
  item: Car | SaleCar | Tour | null;
  itemName: string;
  image?: string;
  basePrice?: number;
  totalPrice?: number;
  startDate?: string;
  endDate?: string;
  days?: number;
  withDriver?: boolean;
  pickupLocation?: string;
  rentalDuration?: string;
}

export interface PartnerRequest {
  id: number;
  name: string;
  phone: string;
  carBrand: string;
  modelYear: number;
  km: number;
  description: string;
  date: Date;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export interface Feedback {
  id: number;
  category: 'BUG' | 'FEATURE' | 'GENERAL' | 'CONTENT' | 'OTHER';
  rating: number; // 1-5
  message: string;
  date: Date;
  status: 'NEW' | 'REVIEWED' | 'ARCHIVED';
}

const ABOUT_STORY = `Alperler Rent A Car, sıradan bir ticarethane değil, temelleri sevgi ve aile bağlarıyla atılmış bir hayalin gerçeğe dönüşmesidir. Bu hikaye, İshak Alper ve kardeşi Ferhat Alper'in, yeğenleri (Hicran Hanım'ın oğlu) Alper'in geleceğini inşa etme arzusuyla başlar.

Ailenin birleştirici gücü olan Genel Müdürümüz Hicran Alper, bir anne şefkati ve disipliniyle şirketin operasyonlarını yönetirken, kurucumuz ve dayısı İshak Alper ise vizyoner kimliğiyle markayı bölgenin zirvesine taşımıştır.`;

@Injectable({
  providedIn: 'root'
})
export class CarService {
  // --- STATE SIGNALS ---
  private _bookingRequest = signal<BookingRequest | null>(null);
  private _favoriteCars = signal<number[]>([]);
  private _visitCount = signal<number>(0); 
  private _partnerRequests = signal<PartnerRequest[]>([]);
  private _feedbacks = signal<Feedback[]>([]);
  private _subscribers = signal<string[]>([]); // Newsletter subscribers
  private _notifications = signal<{id: number, to: string, message: string, date: Date}[]>([]); // Sent notifications log
  
  // --- DATA STORE SIGNALS ---
  
  // 1. Site Configuration
  private _config = signal<SiteConfig>({
    companyName: 'Alperler Rent A Car',
    phone: '0537 959 48 51',
    email: 'info@alperlerrentacar.com',
    address: 'Hakkari Yüksekova Merkez',
    whatsapp: '905379594851',
    instagramUrl: 'https://instagram.com/',
    twitterUrl: 'https://x.com/',
    facebookUrl: 'https://facebook.com/',
    tiktokUrl: 'https://tiktok.com/',
    youtubeUrl: 'https://youtube.com/',
    
    heroTitle: 'Yüksekova\'da Konforun Adresi',
    heroSubtitle: 'Geniş araç filomuz ve profesyonel ekibimizle hizmetinizdeyiz.',

    // Campaigns Section
    campaignEarlyBooking: 'Erken Rezervasyon İndirimi',
    campaignRoadside: 'Kesintisiz Yol Yardım',
    campaignFreeDelivery: 'Havalimanı & Otogar Teslimat',

    // Why Us Section
    whyUsTitle: 'Neden Alperler Rent A Car?',
    whyUsSubtitle: 'İlk seferde değil, her seferde tercihiniz olmak için buradayız. Çünkü biz, sadece anahtar teslim etmiyoruz, size yepyeni bir deneyimin kapılarını aralıyoruz.',
    whyUsTrustTitle: 'Güven ve Kasko',
    whyUsTrustDesc: 'Tam kaskolu, yetkili servis bakımlı araçlar. Sürpriz masraf yok, tam güvence var.',
    whyUsSupportTitle: '7/24 Canlı Destek',
    whyUsSupportDesc: 'Yolculuğunuzun her anında yanınızdayız. Bize 0537 959 48 51 numaralı hattan her an ulaşabilirsiniz.',
    whyUsComfortTitle: 'Konforlu Yolculuk',
    whyUsComfortDesc: 'Her teslimat öncesi detaylı temizlik. Yeni model araçlarla maksimum konfor.',

    // Sales Section
    salesTitle: 'Güvenilir Araç Sahibi Olun',
    salesDesc: 'Ekspertiz garantili, bakımlı ve temiz ikinci el araçlarımızla hayalinizdeki arabaya kavuşun. Takas imkanı ve uygun ödeme seçenekleri sizi bekliyor.',
    salesCta: 'Satılık Araçları İncele',

    // Partner Section
    partnerTitle: 'Aracınızı Bize Kiralayın',
    partnerSubtitle: 'Aracınız yatarak değil, çalışarak kazandırsın. Alperler güvencesiyle aracınızı filomuza katın, düzenli gelir elde edin.',
    partnerRequirementYear: 'En az 2017 Model olmalıdır.',

    aboutTitle: 'AİLE BAĞLARINDAN DOĞAN GÜÇ',
    aboutText: ABOUT_STORY,
    team: [
        { id: 1, name: 'İshak Alper', role: 'Kurucu & Yön. Krl. Bşk.', description: 'Pazarlama ve Strateji Dehası', image: 'https://picsum.photos/id/1062/200/200' },
        { id: 2, name: 'Hicran Alper', role: 'Genel Müdür', description: 'Finans ve İdari Yönetim', image: 'https://picsum.photos/id/338/200/200' },
        { id: 3, name: 'Ferhat Alper', role: 'Kurucu Ortak', description: 'Saha Operasyon & Şoför', image: 'https://picsum.photos/id/203/200/200' },
        { id: 4, name: 'Erkan Baykal', role: 'Transfer Uzmanı', description: 'VIP Transfer & Kaptan Şoför', image: 'https://picsum.photos/id/1005/200/200' },
        { id: 5, name: 'Selim Alper', role: 'Teknik Sorumlu', description: 'Yazılım & Araç Ön Bakım', image: 'https://picsum.photos/id/60/200/200' },
        { id: 6, name: 'İmran Alper', role: 'Müşteri İlişkileri', description: 'Rezervasyon & Transfer Şoförü', image: 'https://picsum.photos/id/91/200/200' }
    ],

    footerText: "Yüksekova'da güvenilir araç kiralama hizmetiyle hayallerinizin yol arkadaşı. Premium hizmet, güvenli yolculuk.",
    kvkkText: `
# KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ HAKKINDA AYDINLATMA METNİ

Alperler Rent A Car olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz.

1. Veri Sorumlusu
Kişisel verileriniz, veri sorumlusu sıfatıyla Alperler Rent A Car tarafından aşağıda açıklanan kapsamda işlenebilecektir.

2. Kişisel Verilerin İşlenme Amacı
Toplanan kişisel verileriniz;
- Araç kiralama hizmetlerinin sunulabilmesi,
- Rezervasyon işlemlerinin gerçekleştirilmesi,
- Yasal yükümlülüklerin yerine getirilmesi (Emniyet Genel Müdürlüğü KABİS bildirimi vb.),
- Müşteri memnuniyetinin artırılması,
amaçlarıyla işlenmektedir.

3. İşlenen Kişisel Veriler
- Kimlik Bilgileri (Ad, Soyad, T.C. Kimlik No)
- İletişim Bilgileri (Telefon, E-posta, Adres)
- Ehliyet ve Pasaport Bilgileri
- Finansal Bilgiler (Kredi Kartı Bilgileri - Sadece provizyon ve ödeme için)

4. Kişisel Verilerin Aktarılması
Kişisel verileriniz, yasal zorunluluklar (Emniyet, Adli Makamlar) dışında üçüncü kişilerle paylaşılmamaktadır.

5. Haklarınız
KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme haklarına sahipsiniz.
    `,
    privacyText: `
# GİZLİLİK POLİTİKASI

Alperler Rent A Car ("Şirket"), müşterilerinin gizliliğine saygı duyar ve verilerini korumayı taahhüt eder.

1. Bilgi Toplama
Sitemizi ziyaret ettiğinizde veya araç kiraladığınızda, hizmet sunmak için gerekli olan temel bilgileri topluyoruz.

2. Bilgi Kullanımı
Topladığımız bilgiler, rezervasyonunuzu yönetmek, size destek sağlamak ve hizmet kalitemizi artırmak için kullanılır.

3. Güvenlik
Verileriniz, endüstri standardı güvenlik önlemleri (SSL şifreleme, güvenli sunucular) ile korunmaktadır. Kredi kartı bilgileriniz sistemlerimizde saklanmaz, doğrudan banka altyapısı üzerinden işlenir.

4. Üçüncü Taraf Bağlantıları
Sitemiz, diğer web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından sorumlu değiliz.
    `,
    cookiesText: `
# ÇEREZ (COOKIE) POLİTİKASI

Alperler Rent A Car olarak, web sitemizden en verimli şekilde faydalanabilmeniz ve kullanıcı deneyiminizi geliştirebilmek için çerezler kullanıyoruz.

1. Çerez Nedir?
Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla cihazınıza veya ağ sunucusuna depolanan küçük metin dosyalarıdır.

2. Kullanılan Çerez Türleri
- Zorunlu Çerezler: Sitenin çalışması için gereklidir.
- Performans Çerezleri: Ziyaretçi sayısını ve trafiği analiz etmemizi sağlar.
- İşlevsellik Çerezleri: Dil tercihi gibi ayarlarınızı hatırlar.

3. Çerez Yönetimi
Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz. Ancak bu durumda sitenin bazı fonksiyonları çalışmayabilir.
    `,
    termsText: `
# ARAÇ KİRALAMA VE KULLANIM KOŞULLARI

Lütfen araç kiralamadan önce aşağıdaki koşulları dikkatlice okuyunuz. Rezervasyon yapan her müşteri bu koşulları kabul etmiş sayılır.

1. EHLİYET VE YAŞ SINIRI
- Ekonomik grup araçlar için en az 21 yaş ve 2 yıllık ehliyet.
- Orta grup araçlar için en az 23 yaş ve 3 yıllık ehliyet.
- Üst grup ve SUV araçlar için en az 25 yaş ve 5 yıllık ehliyet gereklidir.

2. KİRALAMA SÜRESİ VE GECİKMELER
- En az kiralama süresi günlük kiralamalarda 24 saattir.
- Saatlik kiralamalarda minimum süre 6 saattir.
- Gecikmelerde her saat için günlük ücretin 1/3'ü, 3 saati aşan gecikmelerde tam gün ücreti tahsil edilir.
- Uzun süreli kiralamalarda (30 gün ve üzeri) özel fiyatlandırma uygulanır.

3. FİYATA DAHİL OLAN VE OLMAYAN HUSUSLAR
- Dahil Olanlar: Muafiyetli Kasko, Hırsızlık Sigortası, KDV, 7/24 Yol Yardım.
- Dahil Olmayanlar: Yakıt, Köprü/Otoyol geçiş ücretleri (HGS/OGS), Trafik cezaları, Ek sürücü, Bebek koltuğu, Vale hizmeti.

4. ÖDEME VE DEPOZİTO
- Kiralama bedeli araç tesliminde Nakit, Kredi Kartı veya Havale/EFT ile tahsil edilir.
- Araç grubuna göre değişen tutarlarda depozito (provizyon) uygulanır. Bu tutar, araç iadesinden sonra trafik cezası veya eksik yakıt gibi durumlar kontrol edildikten sonra iade edilir.

5. SİGORTA VE KASKO (GÜVENCE)
Tüm araçlarımızda "Muafiyetli Kasko" bulunmaktadır.
Kaskonun geçerli olması için:
- Alkol veya uyuşturucu etkisi altında olunmamalıdır.
- Yasal hız sınırlarına uyulmalıdır.
- Kaza anında araç yerinden oynatılmadan Polis/Jandarma raporu tutulmalıdır.
- Rapor tutulmayan hasarlardan kiracı %100 sorumludur.
- Lastik, cam ve far hasarları standart kasko kapsamı dışındadır (Ek güvence satın alınabilir).
- Aracın alt kısmının vurulması, döşeme yanıkları ve anahtar kaybı kasko kapsamı dışındadır.

6. SAATLİK KİRALAMA KOŞULLARI
- Saatlik kiralama hizmetimiz mevcuttur.
- Minimum kiralama süresi 6 saattir.
- 6-12 saat arası kiralamalarda günlük ücretin %60'ı, 12 saat üzeri kiralamalarda tam gün ücreti tahsil edilir.
- Saatlik kiralamalarda km sınırı uygulanabilir (Örn: 6 saat için 100km).

7. İPTAL VE İADE KOŞULLARI
- Rezervasyon tarihine 24 saat kala yapılan iptallerde ücretin tamamı iade edilir.
- 24 saatten az kalan iptallerde 1 günlük kira bedeli kesilir.
- Araç teslim alındıktan sonra erken iade durumunda, kalan günlerin ücreti iade edilmez.

8. YAKIT POLİTİKASI
- Araçlar teslim edildiği yakıt seviyesinde iade alınır. 
- Eksik yakıtla iadelerde yakıt bedeli + %20 hizmet bedeli tahsil edilir.
- Fazla yakıtla iadelerde ücret iadesi yapılmaz.

9. YURT DIŞINA ÇIKIŞ
- Kiralanan araçlarla yurt dışına çıkılamaz.

10. TRAFİK CEZALARI
- Kiralama süresince oluşan tüm trafik cezaları (HGS, OGS, radar, park vb.) kiracıya aittir.
- Cezalar, kiralama bitiminden sonra tebliğ edilirse, kiracının kredi kartından tahsil edilir veya yasal yollara başvurulur.

11. ŞOFÖRLÜ KİRALAMA
- Şoförlü kiralamalarda yakıt, şoförün konaklama ve yemek giderleri kiracıya aittir (aksi belirtilmedikçe).
- Şoförün çalışma saatleri günlük maksimum 10 saattir.

Alperler Rent A Car, önceden haber vermeksizin koşulları değiştirme hakkını saklı tutar.
    `,

    theme: 'light'
  });

  // 7. FAQs
  private _faqs = signal<FaqItem[]>([
    { id: 1, question: "Araç kiralama için hangi belgeler gerekli?", answer: "Geçerli ehliyet, kimlik belgesi ve kredi kartı yeterlidir. Yabancı uyruklu müşterilerimiz için pasaport ve uluslararası ehliyet gereklidir." },
    { id: 2, question: "Minimum kiralama süresi nedir?", answer: "Minimum kiralama süremiz saatlik kiralamalarda 6 saattir. Günlük kiralamalarda ise 24 saattir." },
    { id: 3, question: "Araçları başka şehirde teslim edebilir miyim?", answer: "Evet, ek ücret karşılığında farklı şehirlerde araç teslimi yapabilirsiniz. Detaylar için 0537 959 48 51 numaralı hattımızdan bizimle iletişime geçin." },
    { id: 4, question: "Hasar durumunda ne yapmalıyım?", answer: "Herhangi bir hasar durumunda derhal 0537 959 48 51 numaralı hattımızdan bizimle iletişime geçin. Kasko sigortamız kapsamında gerekli işlemler başlatılacaktır." },
    { id: 5, question: "Depozito (Provizyon) alıyor musunuz?", answer: "Evet, araç grubuna göre değişen miktarlarda kredi kartından provizyon alınmaktadır. Araç tesliminden sonra bu tutar iade edilir." },
    { id: 6, question: "Bilgilerimin güvenliği nasıl sağlanıyor?", answer: "Tüm kişisel bilgileriniz SSL şifreleme ile korunmakta ve KVKK kapsamında güvenli bir şekilde saklanmaktadır." }
  ]);

  // 2. Cars
  private _cars = signal<Car[]>([
    // SUV
    { 
        id: 1, brand: 'Nissan', model: 'Qashqai', type: 'SUV', transmission: 'Otomatik', fuel: 'Dizel', price: 4500, 
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Cam Tavan', 'Geri Görüş', 'Start-Stop'], isAvailable: true 
    },
    { 
        id: 2, brand: 'Peugeot', model: '3008', type: 'SUV', transmission: 'Otomatik', fuel: 'Dizel', price: 4800, 
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Hayalet Ekran', 'E-Toggle', 'Şerit Takip'], isAvailable: true 
    },
    { 
        id: 3, brand: 'Volkswagen', model: 'Tiguan', type: 'SUV', transmission: 'Otomatik', fuel: 'Benzin', price: 5200, 
        image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['IQ.Light', 'Cam Tavan', 'Apple CarPlay'], isAvailable: false 
    },
    { 
        id: 4, brand: 'Dacia', model: 'Duster', type: 'SUV', transmission: 'Manuel', fuel: 'Dizel', price: 3500, 
        image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Ekonomik', 'Geniş Bagaj', 'Yüksek Sürüş'], isAvailable: true 
    },

    // Sedan
    { 
        id: 5, brand: 'Volkswagen', model: 'Passat', type: 'Sedan', transmission: 'Otomatik', fuel: 'Dizel', price: 4200, 
        image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Makam Konforu', 'Deri Koltuk', 'Geniş İç Hacim'], isAvailable: true 
    },
    { 
        id: 6, brand: 'Toyota', model: 'Corolla', type: 'Sedan', transmission: 'Otomatik', fuel: 'Hibrit', price: 3800, 
        image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Yakıt Cimrisi', 'Sessiz Sürüş', 'Güvenlik Paketi'], isAvailable: true 
    },
    { 
        id: 7, brand: 'Renault', model: 'Megane', type: 'Sedan', transmission: 'Otomatik', fuel: 'Dizel', price: 3600, 
        image: 'https://images.unsplash.com/photo-1617469165786-8007ed3caa37?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1617469165786-8007ed3caa37?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Tesla Ekran', 'Led Far', 'Sport Mod'], isAvailable: true 
    },
    { 
        id: 8, brand: 'Fiat', model: 'Egea Cross', type: 'Sedan', transmission: 'Manuel', fuel: 'Benzin', price: 2800, 
        image: 'https://images.unsplash.com/photo-1655320609876-4c8e5644d184?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1655320609876-4c8e5644d184?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Ekonomik', 'Şehir İçi', 'Apple CarPlay'], isAvailable: true 
    },

    // Pickup
    { 
        id: 9, brand: 'Toyota', model: 'Hilux 4x4', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 5500, 
        image: 'https://images.unsplash.com/photo-1605218457336-92e4a6001a0d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1605218457336-92e4a6001a0d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Arazi Modu', 'Diferansiyel Kilidi', 'Güçlü Motor'], isAvailable: true 
    },
    { 
        id: 10, brand: 'Ford', model: 'Ranger Wildtrak', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 6000, 
        image: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Off-Road', 'Isıtmalı Koltuk', '4x4 Çekiş'], isAvailable: true 
    },
    { 
        id: 11, brand: 'Mitsubishi', model: 'L200', type: 'Pickup', transmission: 'Manuel', fuel: 'Dizel', price: 5000, 
        image: 'https://images.unsplash.com/photo-1598545534767-b589ee269027?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1598545534767-b589ee269027?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Dayanıklı', 'Yük Taşıma', 'Yüksek Tork'], isAvailable: true 
    },
    { 
        id: 12, brand: 'Isuzu', model: 'D-Max', type: 'Pickup', transmission: 'Otomatik', fuel: 'Dizel', price: 5200, 
        image: 'https://images.unsplash.com/photo-1632823469860-42137e0c092d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1632823469860-42137e0c092d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['V-Cross', 'Deri Döşeme', 'Güvenlik Asistanı'], isAvailable: true 
    },

    // Hatchback
    { 
        id: 13, brand: 'Renault', model: 'Clio', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3000, 
        image: 'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Pratik', 'Ekonomik', 'Kolay Park'], isAvailable: true 
    },
    { 
        id: 14, brand: 'Hyundai', model: 'i20', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3100, 
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Sportif', 'Geniş Ekran', 'Şerit Takip'], isAvailable: true 
    },
    { 
        id: 15, brand: 'Volkswagen', model: 'Polo', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3400, 
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1635785137860-e8c603e73a2b?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Konforlu', 'DSG Şanzıman', 'Kaliteli İç Mekan'], isAvailable: true 
    },
    { 
        id: 16, brand: 'Peugeot', model: '208', type: 'Hatchback', transmission: 'Otomatik', fuel: 'Benzin', price: 3300, 
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['i-Cockpit', 'Aslan Dişi Led', 'Kompakt'], isAvailable: true 
    },
    
    // Luxury
    { 
        id: 17, brand: 'Mercedes-Benz', model: 'E-Class', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8500, 
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Makam Aracı', 'Masajlı Koltuk', 'Vakum Kapı'], isAvailable: true 
    },
    { 
        id: 18, brand: 'BMW', model: '520i', type: 'Luxury', transmission: 'Otomatik', fuel: 'Benzin', price: 8500, 
        image: 'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1555215695-3004980adade?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['M Sport', 'Harman Kardon', 'Laser Light'], isAvailable: true 
    },
    { 
        id: 19, brand: 'Audi', model: 'A6', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8200, 
        image: 'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['Quattro', 'Matrix Led', 'Çift Ekran'], isAvailable: true 
    },
    { 
        id: 21, brand: 'Volvo', model: 'S90', type: 'Luxury', transmission: 'Otomatik', fuel: 'Dizel', price: 8000, 
        image: 'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop', 
        images: [
            'https://images.unsplash.com/photo-1619712068019-d10823490484?q=80&w=1000&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606152421811-991d589363bd?q=80&w=1000&auto=format&fit=crop'
        ],
        seats: 5, features: ['En Güvenli', 'Otonom Sürüş', 'Bowers & Wilkins'], isAvailable: true 
    }
  ]);

  // 3. Sale Cars
  private _saleCars = signal<SaleCar[]>([
    { id: 101, brand: 'Mercedes-Benz', model: 'C 200 4MATIC AMG', year: 2023, km: 12000, price: 3650000, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop', description: 'Hatasız, boyasız, sıfır ayarında. AMG paket, gece paketi.', features: ['Cam Tavan', 'Burmester', 'Otonom', '360 Kamera'], expertReport: 'Hatasız, Boyasız, Tramer Yok', transmission: 'Otomatik', fuel: 'Benzin' }
  ]);

  // 4. Blog Posts
  private _blogPosts = signal<BlogPost[]>([
    { id: 1, title: "Cilo Dağları'nda Bir Masal", summary: "Yüksekova'nın saklı cenneti Cilo Dağları ve Cennet-Cehennem Vadisi gezi rehberi.", image: "https://picsum.photos/id/1036/1200/800", readTime: "6 dk okuma", date: "25 Mayıs 2024", content: "<p>Yüksekova doğası...</p>" },
    { id: 2, title: "Ters Lale Zamanı", summary: "Hakkari'nin simgesi, ağlayan gelin 'Ters Lale'yi görmeniz için en iyi zamanlar.", image: "https://picsum.photos/id/200/1200/800", readTime: "4 dk okuma", date: "10 Nisan 2024", content: "<p>Ters Lale hakkında...</p>" }
  ]);

  // 5. Reservations
  private _reservations = signal<BookingRequest[]>([]);
  
  // 6. Tours
  private _tours = signal<Tour[]>([
    { id: 1, title: 'Cilo Dağları & Buzullar Zirvesi', duration: 'Tam Gün', price: 4500, description: 'Türkiye’nin en yüksek 2. zirvesi ve 4 mevsim erimeyen buzullarına efsanevi bir yolculuk.', highlights: ['Uludoruk Buzulları', 'Cennet-Cehennem Vadisi', 'Yayla Kahvaltısı'], image: 'https://picsum.photos/id/1036/800/600' },
    { id: 2, title: 'Sat Buzul Gölleri & Şelaleler', duration: 'Tam Gün', price: 4000, description: '3000 metre rakımda turkuaz rengi göllerin ve gürül gürül akan şelalelerin eşsiz manzarası.', highlights: ['Sat Gölleri', 'Doğa Yürüyüşü', 'Piknik', 'Fotoğraf Safari'], image: 'https://picsum.photos/id/1043/800/600' },
    { id: 3, title: 'Zap Vadisi & Rafting Heyecanı', duration: 'Yarım Gün', price: 2500, description: 'Zap Suyu’nun hırçın dalgalarında adrenalin dolu bir rafting deneyimi ve vadi manzarası.', highlights: ['Rafting', 'Asma Köprü', 'Vadi Manzarası'], image: 'https://picsum.photos/id/1015/800/600' },
    { id: 4, title: 'Şemdinli & Nehri İnanç Turu', duration: 'Tam Gün', price: 3500, description: 'Tarihi Taş Köprü, Kayme Sarayı ve Nehri’nin manevi atmosferinde kültürel bir yolculuk.', highlights: ['Taş Köprü', 'Kayme Sarayı', 'Seyir Terası'], image: 'https://picsum.photos/id/1040/800/600' },
    { id: 5, title: 'Berçelan Yaylası & Kamp', duration: '2 Gün 1 Gece', price: 6000, description: 'Yıldızların altında kamp, yayla havası ve dört mevsimi bir arada yaşama şansı.', highlights: ['Kamp Ateşi', 'Trekking', 'Yayla Yaşamı'], image: 'https://picsum.photos/id/1018/800/600' },
    { id: 6, title: 'Yeşiltaş Köyü & Doğa Gezisi', duration: 'Tam Gün', price: 3000, description: 'Yüksekova’nın saklı cenneti Yeşiltaş Köyü’nde doğa ile iç içe, huzur dolu bir gün.', highlights: ['Köy Kahvaltısı', 'Doğa Yürüyüşü', 'Fotoğrafçılık'], image: 'https://picsum.photos/id/1039/800/600' }
  ]);

  private genAI: GoogleGenAI;
  private apiKey = (typeof process !== 'undefined' && process.env && process.env['API_KEY']) || '';

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    this.loadFromStorage();

    // Increment Visit Counter
    this.incrementVisitCount();

    effect(() => localStorage.setItem('db_config', JSON.stringify(this._config())));
    effect(() => localStorage.setItem('db_cars', JSON.stringify(this._cars())));
    effect(() => localStorage.setItem('db_saleCars', JSON.stringify(this._saleCars())));
    effect(() => localStorage.setItem('db_blog', JSON.stringify(this._blogPosts())));
    effect(() => localStorage.setItem('db_reservations', JSON.stringify(this._reservations())));
    effect(() => localStorage.setItem('db_partnerRequests', JSON.stringify(this._partnerRequests())));
    effect(() => localStorage.setItem('db_visits', this._visitCount().toString()));
    effect(() => localStorage.setItem('db_faqs', JSON.stringify(this._faqs())));
    effect(() => localStorage.setItem('db_feedbacks', JSON.stringify(this._feedbacks())));
    effect(() => localStorage.setItem('db_subscribers', JSON.stringify(this._subscribers())));
    effect(() => localStorage.setItem('db_notifications', JSON.stringify(this._notifications())));

    // Listen for storage changes in other tabs
    window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('db_')) {
            this.loadFromStorage();
        }
    });
  }

  private loadFromStorage() {
      const config = localStorage.getItem('db_config');
      if (config) {
          const parsedConfig = JSON.parse(config);
          // Ensure new fields exist if loading from old storage
          if(!parsedConfig.aboutText) parsedConfig.aboutText = ABOUT_STORY;
          
          // Force update legal texts if they are the old placeholders
          if(!parsedConfig.kvkkText || parsedConfig.kvkkText === "Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında...") {
              parsedConfig.kvkkText = this._config().kvkkText;
          }
          if(!parsedConfig.privacyText || parsedConfig.privacyText === "Gizlilik politikamız...") {
              parsedConfig.privacyText = this._config().privacyText;
          }
          if(!parsedConfig.cookiesText || parsedConfig.cookiesText === "Çerez kullanım politikamız...") {
              parsedConfig.cookiesText = this._config().cookiesText;
          }
          if(!parsedConfig.termsText || parsedConfig.termsText === "Araç kiralama ve kullanım koşulları...") {
              parsedConfig.termsText = this._config().termsText;
          }
          
          // New Fields Default
          if(!parsedConfig.heroTitle) parsedConfig.heroTitle = 'Yüksekova\'da Güvenli Kiralama, Satış ve Filo Hizmetleri';
          if(!parsedConfig.heroSubtitle) parsedConfig.heroSubtitle = 'İster şoförlü ister şoförsüz kiralayın, ister güvenle araç satın alın, isterseniz aracınızı bize kiralayıp gelir elde edin. Alperler güvencesiyle hepsi tek adreste.';

          if(!parsedConfig.campaignEarlyBooking) parsedConfig.campaignEarlyBooking = 'Erken Rezervasyon İndirimi';
          if(!parsedConfig.campaignRoadside) parsedConfig.campaignRoadside = 'Kesintisiz Yol Yardım';
          if(!parsedConfig.campaignFreeDelivery) parsedConfig.campaignFreeDelivery = 'Havalimanı & Otogar Teslimat';
          
          if(!parsedConfig.whyUsTitle) parsedConfig.whyUsTitle = 'Neden Alperler Rent A Car?';
          if(!parsedConfig.whyUsSubtitle) parsedConfig.whyUsSubtitle = 'İlk seferde değil, her seferde tercihiniz olmak için buradayız. Çünkü biz, sadece anahtar teslim etmiyoruz, size yepyeni bir deneyimin kapılarını aralıyoruz.';
          if(!parsedConfig.whyUsTrustTitle) parsedConfig.whyUsTrustTitle = 'Güven ve Kasko';
          if(!parsedConfig.whyUsTrustDesc) parsedConfig.whyUsTrustDesc = 'Tam kaskolu, yetkili servis bakımlı araçlar. Sürpriz masraf yok, tam güvence var.';
          if(!parsedConfig.whyUsSupportTitle) parsedConfig.whyUsSupportTitle = '7/24 Canlı Destek';
          if(!parsedConfig.whyUsSupportDesc) parsedConfig.whyUsSupportDesc = 'Yolculuğunuzun her anında yanınızdayız. Bize 0537 959 48 51 numaralı hattan her an ulaşabilirsiniz.';
          if(!parsedConfig.whyUsComfortTitle) parsedConfig.whyUsComfortTitle = 'Konforlu Yolculuk';
          if(!parsedConfig.whyUsComfortDesc) parsedConfig.whyUsComfortDesc = 'Her teslimat öncesi detaylı temizlik. Yeni model araçlarla maksimum konfor.';

          if(!parsedConfig.salesTitle) parsedConfig.salesTitle = 'Güvenilir Araç Sahibi Olun';
          if(!parsedConfig.salesDesc) parsedConfig.salesDesc = 'Ekspertiz garantili, bakımlı ve temiz ikinci el araçlarımızla hayalinizdeki arabaya kavuşun. Takas imkanı ve uygun ödeme seçenekleri sizi bekliyor.';
          if(!parsedConfig.salesCta) parsedConfig.salesCta = 'Satılık Araçları İncele';

          if(!parsedConfig.partnerTitle) parsedConfig.partnerTitle = 'Aracınızı Bize Kiralayın';
          if(!parsedConfig.partnerSubtitle) parsedConfig.partnerSubtitle = 'Aracınız yatarak değil, çalışarak kazandırsın. Alperler güvencesiyle aracınızı filomuza katın, düzenli gelir elde edin.';
          if(!parsedConfig.partnerRequirementYear) parsedConfig.partnerRequirementYear = 'En az 2017 Model olmalıdır.';

          this._config.set(parsedConfig);
      }

      const cars = localStorage.getItem('db_cars');
      if (cars) {
         const parsedCars = JSON.parse(cars);
         if(parsedCars.length > 0) this._cars.set(parsedCars);
      }

      const saleCars = localStorage.getItem('db_saleCars');
      if (saleCars) this._saleCars.set(JSON.parse(saleCars));

      const blog = localStorage.getItem('db_blog');
      if (blog) this._blogPosts.set(JSON.parse(blog));
      
      const reservations = localStorage.getItem('db_reservations');
      if (reservations) this._reservations.set(JSON.parse(reservations));

      const partnerRequests = localStorage.getItem('db_partnerRequests');
      if (partnerRequests) this._partnerRequests.set(JSON.parse(partnerRequests));

      const visits = localStorage.getItem('db_visits');
      if(visits) this._visitCount.set(parseInt(visits));

      const faqs = localStorage.getItem('db_faqs');
      if (faqs) this._faqs.set(JSON.parse(faqs));

      const feedbacks = localStorage.getItem('db_feedbacks');
      if (feedbacks) this._feedbacks.set(JSON.parse(feedbacks));

      const subscribers = localStorage.getItem('db_subscribers');
      if (subscribers) this._subscribers.set(JSON.parse(subscribers));

      const notifications = localStorage.getItem('db_notifications');
      if (notifications) this._notifications.set(JSON.parse(notifications));
  }

  private incrementVisitCount() {
     if(!sessionStorage.getItem('session_active')) {
        sessionStorage.setItem('session_active', 'true');
        this._visitCount.update(c => c + 1);
     }
  }

  // --- PUBLIC METHODS ---
  
  resetStats() {
      this._visitCount.set(0);
      localStorage.removeItem('db_visits');
      sessionStorage.removeItem('session_active');
  }

  // --- PUBLIC GETTERS ---
  getConfig() { return this._config.asReadonly(); }
  getCars() { return this._cars.asReadonly(); }
  getCar(id: number) { return this._cars().find(c => c.id === id); }
  getSaleCars() { return this._saleCars.asReadonly(); }
  getSaleCar(id: number) { return this._saleCars().find(c => c.id === id); }
  getTours() { return this._tours.asReadonly(); }
  getTour(id: number) { return this._tours().find(t => t.id === id); }
  getBlogPosts() { return this._blogPosts.asReadonly(); }
  getBlogPost(id: number) { return this._blogPosts().find(p => p.id === id); }
  getReservations() { return this._reservations.asReadonly(); }
  getPartnerRequests() { return this._partnerRequests.asReadonly(); }
  getVisitCount() { return this._visitCount.asReadonly(); }
  getFaqs() { return this._faqs.asReadonly(); }
  getFeedbacks() { return this._feedbacks.asReadonly(); }
  getSubscribers() { return this._subscribers.asReadonly(); }
  getNotifications() { return this._notifications.asReadonly(); }

  // --- ADMIN ACTIONS ---
  
  addFeedback(feedback: Omit<Feedback, 'id' | 'date' | 'status'>) {
      const newFeedback: Feedback = {
          ...feedback,
          id: Date.now(),
          date: new Date(),
          status: 'NEW'
      };
      this._feedbacks.update(f => [newFeedback, ...f]);
  }

  updateFeedbackStatus(id: number, status: 'NEW' | 'REVIEWED' | 'ARCHIVED') {
      this._feedbacks.update(f => f.map(x => x.id === id ? { ...x, status } : x));
  }

  deleteFeedback(id: number) {
      this._feedbacks.update(f => f.filter(x => x.id !== id));
  }

  addFaq(faq: FaqItem) {
      this._faqs.update(f => {
          if (faq.id && f.find(x => x.id === faq.id)) {
              return f.map(x => x.id === faq.id ? faq : x);
          } else {
              return [{ ...faq, id: Date.now() }, ...f];
          }
      });
  }
  deleteFaq(id: number) {
      this._faqs.update(f => f.filter(x => x.id !== id));
  }

  addTour(tour: Tour) {
      this._tours.update(t => {
          if (tour.id && t.find(x => x.id === tour.id)) {
              return t.map(x => x.id === tour.id ? tour : x);
          } else {
              return [{ ...tour, id: Date.now() }, ...t];
          }
      });
  }
  deleteTour(id: number) {
      this._tours.update(t => t.filter(x => x.id !== id));
  }

  addPartnerRequest(req: Omit<PartnerRequest, 'id' | 'date'>) {
    const newReq: PartnerRequest = {
      ...req,
      id: Date.now(),
      date: new Date()
    };
    this._partnerRequests.update(reqs => [newReq, ...reqs]);
  }

  deletePartnerRequest(id: number) {
    this._partnerRequests.update(reqs => reqs.filter(r => r.id !== id));
  }

  updateConfig(newConfig: SiteConfig) {
    this._config.set(newConfig);
  }

  addCar(car: Car) {
      this._cars.update(c => {
          if (car.id && c.find(x => x.id === car.id)) {
              return c.map(x => x.id === car.id ? car : x);
          } else {
              return [{ ...car, id: Date.now() }, ...c];
          }
      });
  }
  deleteCar(id: number) {
      this._cars.update(cars => cars.filter(c => c.id !== id));
  }

  addSaleCar(car: SaleCar) {
      this._saleCars.update(c => {
          if (car.id && c.find(x => x.id === car.id)) {
              return c.map(x => x.id === car.id ? car : x);
          } else {
              return [{ ...car, id: Date.now() }, ...c];
          }
      });
  }
  deleteSaleCar(id: number) {
      this._saleCars.update(cars => cars.filter(c => c.id !== id));
  }

  addBlogPost(post: BlogPost) {
      this._blogPosts.update(posts => [{ ...post, id: Date.now() }, ...posts]);
  }
  deleteBlogPost(id: number) {
      this._blogPosts.update(posts => posts.filter(p => p.id !== id));
  }

  addReservation(req: BookingRequest) {
      const newRes: BookingRequest = {
          ...req,
          id: `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: 'PENDING',
          dateCreated: new Date()
      };
      this._reservations.update(res => [newRes, ...res]);
      
      // Notify admin (simulated)
      this.sendNotification('admin@alperler.com', `Yeni rezervasyon talebi: ${newRes.id} - ${newRes.customerName}`);
  }
  updateReservationStatus(id: string, status: 'APPROVED' | 'REJECTED') {
      this._reservations.update(res => res.map(r => {
          if (r.id === id) {
              // Simulate notification
              const msg = status === 'APPROVED' 
                  ? `Sayın ${r.customerName}, rezervasyonunuz ONAYLANDI. Sözleşme ve detaylar e-posta adresinize gönderildi.`
                  : `Sayın ${r.customerName}, rezervasyon talebiniz maalesef ONAYLANAMADI.`;
              
              if (r.customerEmail) {
                  this.sendNotification(r.customerEmail, msg);
              }
              if (r.customerPhone) {
                  this.sendNotification(r.customerPhone, msg);
              }
              
              return { ...r, status };
          }
          return r;
      }));
  }

  setBookingRequest(request: BookingRequest) { this._bookingRequest.set(request); }
  getBookingRequest() { return this._bookingRequest(); }
  clearBookingRequest() { this._bookingRequest.set(null); }
  
  toggleFavorite(id: number) {
    this._favoriteCars.update(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  }
  isFavorite(id: number) { return this._favoriteCars().includes(id); }
  getFavoriteCount = computed(() => this._favoriteCars().length);

  // --- NEWSLETTER & NOTIFICATIONS ---
  addSubscriber(email: string) {
      if (!this._subscribers().includes(email)) {
          this._subscribers.update(s => [email, ...s]);
      }
  }

  // Production-ready notification handler
  sendNotification(to: string, message: string) {
      const notification = { id: Date.now(), to, message, date: new Date() };
      
      // 1. Log to internal system (Admin Panel)
      this._notifications.update(n => [notification, ...n]);

      // 2. Try to send real Email/SMS if configured
      this.dispatchExternalNotification(to, message);
  }

  deleteNotification(id: number) {
      this._notifications.update(n => n.filter(x => x.id !== id));
  }

  clearAllNotifications() {
      this._notifications.set([]);
  }

  private dispatchExternalNotification(to: string, message: string) {
      // This is where the real API integration happens.
      // When the domain is connected and backend is active, these flags would be true.
      const isProduction = false; // Set to true when domain/API is ready
      
      if (isProduction) {
          console.log(`[REAL EMAIL/SMS SENT] To: ${to}, Msg: ${message}`);
          // Example: this.http.post('/api/send-email', { to, message }).subscribe();
      } else {
          console.log(`[SIMULATION] Notification logged for ${to}`);
      }
  }

  // --- SUPERCHARGED AI ---
  async analyzeFeedback(): Promise<string> {
    if (!this.apiKey) return "AI servisi şu an kullanılamıyor.";
    
    const feedbacks = this._feedbacks();
    if (feedbacks.length === 0) return "Henüz analiz edilecek geri bildirim bulunmuyor.";

    const feedbackText = feedbacks.map(f => 
        `- [${f.category}] (${f.rating}/5): ${f.message}`
    ).join('\n');

    const prompt = `
        ROLE: You are an expert data analyst for Alperler Rent A Car.
        TASK: Analyze the following customer feedback and provide a summary in Turkish.
        
        FEEDBACK DATA:
        ${feedbackText}

        INSTRUCTIONS:
        1. Summarize the overall sentiment (Positive, Neutral, Negative).
        2. Identify top 3 common issues or requests.
        3. Suggest 2 actionable improvements.
        4. Keep it professional and concise.
    `;

    try {
        const result = await this.genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return result.text || "Analiz tamamlanamadı.";
    } catch (error) {
        console.error("Feedback Analysis Error", error);
        return "Analiz sırasında bir hata oluştu.";
    }
  }

  async getAIRecommendation(userQuery: string): Promise<string> {
    if (!this.apiKey) {
      return `Üzgünüm, şu an bağlantı kurulamıyor. Lütfen telefonla bizi arayın: ${this._config().phone}`;
    }
    try {
      // Prepare Context Data
      const contextData = {
        availableRentalCars: this._cars().filter(c => c.isAvailable).map(c => ({
           brand: c.brand, model: c.model, type: c.type, price: c.price, fuel: c.fuel, gear: c.transmission, seats: c.seats
        })),
        salesGallery: this._saleCars().map(c => ({
           brand: c.brand, model: c.model, year: c.year, price: c.price, km: c.km, expertReport: c.expertReport
        })),
        tours: this._tours().map(t => ({
           title: t.title, price: t.price, duration: t.duration
        })),
        companyInfo: {
           name: this._config().companyName,
           phone: this._config().phone,
           address: this._config().address,
           aboutStory: this._config().aboutText
        }
      };

      const contextString = JSON.stringify(contextData);

      const prompt = `
        ROLE: You are 'Alper AI', the intelligent, persuasive, and friendly sales assistant for Alperler Rent A Car in Yüksekova.
        
        GOAL: Assist customers by finding the best cars, answering questions about the company story, and encouraging them to book or buy. You have full access to the inventory.
        
        CONTEXT DATA (Live Inventory):
        ${contextString}

        INSTRUCTIONS:
        1. STRICTLY LIMIT YOUR ANSWERS TO THE CONTEXT OF CAR RENTAL, TOURS, AND VEHICLE SALES. DO NOT ANSWER GENERAL KNOWLEDGE QUESTIONS UNLESS RELATED TO DRIVING OR TRAVEL IN THE REGION.
        2. Search the CONTEXT DATA to answer specific questions (e.g., "cheapest car", "SUV prices", "who is Ishak Alper").
        3. If the user asks for a car recommendation, suggest a specific vehicle from the list and mention its price. Ask about their budget or needs if unclear.
        4. If asked about the company, summarize the family story (Ishak, Ferhat, Hicran Alper) warmly.
        5. Always be polite, professional, and sales-oriented. End answers with a call to action (e.g., "Would you like to reserve this now?" or "Shall I connect you to an agent?").
        6. You can help with technical problems or feedback. If a user reports an issue, apologize and suggest they contact support immediately via WhatsApp.
        7. If the user wants to BUY a car (Second Hand), check the 'salesGallery' list and promote those cars.
        8. If the user wants a TOUR, check the 'tours' list.
        9. Speak in Turkish.
        10. Be concise but helpful.
        11. DO NOT use markdown formatting (bold, italics, headers, lists, asterisks, hashes) in your response. Provide plain text only so the voice assistant can read it clearly.

        USER QUESTION: "${userQuery}"
      `;

      const result = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      
      return result.text || "Şu an yanıt veremiyorum.";
    } catch (error) {
      console.error("AI Error", error);
      return `Şu an size yanıt veremiyorum. Lütfen ${this._config().phone} numarasından bize ulaşın, hemen yardımcı olalım.`;
    }
  }
}
